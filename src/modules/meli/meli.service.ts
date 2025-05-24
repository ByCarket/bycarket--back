// src/modules/meli/meli.service.ts

import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';
import { Post } from '../../entities/post.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { MeliToken } from '../../entities/meliToken.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class MeliService {
  private readonly logger = new Logger(MeliService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(MeliToken)
    private tokenRepository: Repository<MeliToken>,

    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('MELI_CLIENT_ID') ?? (() => { throw new Error('MELI_CLIENT_ID is not set'); })();
    this.clientSecret = this.configService.get<string>('MELI_CLIENT_SECRET') ?? (() => { throw new Error('MELI_CLIENT_SECRET is not set'); })();
    this.redirectUri = this.configService.get<string>('MELI_REDIRECT_URI') ?? (() => { throw new Error('MELI_REDIRECT_URI is not set'); })();
  }

getAuthUrl(vehicleId: string) {
  const state = encodeURIComponent(JSON.stringify({ vehicleId }));
  return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&state=${state}`;
}



  async getAccessToken(code: string, userId: string, vehicleId?: string) {
  const data = {
    grant_type: 'authorization_code',
    client_id: this.clientId,
    client_secret: this.clientSecret,
    code,
    redirect_uri: this.redirectUri, // sin `vehicleId`
  };

  const response = await firstValueFrom(
    this.httpService.post('https://api.mercadolibre.com/oauth/token', qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  );

  const { access_token, refresh_token, user_id, expires_in } = response.data;

  const expiresAt = new Date(Date.now() + expires_in * 1000);

  const meliToken = this.tokenRepository.create({
    user: { id: userId },
    meliUserId: user_id,
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt,
  });

  await this.tokenRepository.save(meliToken);

  // Si vehicleId está presente, podrías iniciar automáticamente la publicación
  if (vehicleId) {
    await this.publicarDesdePostId(vehicleId, userId); // O podrías guardar en una cola
  }

  return {
    message: 'Token guardado correctamente y publicación realizada (si corresponde)',
    meliUserId: user_id,
  };
}


  async renovarTokenSiHaceFalta(token: MeliToken): Promise<MeliToken> {
    if (new Date() < token.expiresAt) return token;

    const data = {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: token.refreshToken,
    };

    const response = await firstValueFrom(
      this.httpService.post('https://api.mercadolibre.com/oauth/token', qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    token.accessToken = response.data.access_token;
    token.refreshToken = response.data.refresh_token;
    token.expiresAt = new Date(Date.now() + response.data.expires_in * 1000);

    return this.tokenRepository.save(token);
  }

  async publicarDesdePostId(postId: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'vehicle'],
    });

    if (!post || post.user.id !== userId) {
      throw new UnauthorizedException('No tienes acceso a este post.');
    }

    const token = await this.tokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!token) {
      throw new ForbiddenException('Debes conectar tu cuenta de Mercado Libre primero.');
    }

    const validToken = await this.renovarTokenSiHaceFalta(token);

    const itemData = this.mapPostToMeliItem(post);

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://api.mercadolibre.com/items', itemData, {
          headers: {
            Authorization: `Bearer ${validToken.accessToken}`,
          },
        }),
      );

      post.meliItemId = response.data.id;
      await this.postRepository.save(post);

      return {
        success: true,
        meliItemId: response.data.id,
        permalink: response.data.permalink,
        message: 'Publicación creada exitosamente.',
      };
    } catch (error) {
      this.logger.error('Error al publicar en Mercado Libre', error?.response?.data || error);

      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data?.message || 'Error desconocido al publicar en Mercado Libre',
      };
    }
  }

  private mapPostToMeliItem(post: Post) {
    const vehicle = post.vehicle;

    return {
      title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      category_id: 'MLA1743',
      price: vehicle.price,
      currency_id: 'ARS',
      available_quantity: 1,
      buying_mode: 'buy_it_now',
      condition: 'used',
      listing_type_id: 'gold_special',
      pictures: vehicle.photos.map((url) => ({ source: url })),
      attributes: [
        { id: 'BRAND', value_name: vehicle.brand },
        { id: 'MODEL', value_name: vehicle.model },
        { id: 'VEHICLE_YEAR', value_name: vehicle.year.toString() },
        { id: 'TRANSMISSION', value_name: vehicle.transmission || 'Manual' },
      ],
    };
  }


  async eliminarPublicacion(postId: string, userId: string) {
  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['user'],
  });

  if (!post || post.user.id !== userId) {
    throw new UnauthorizedException('No tienes permiso para modificar esta publicación.');
  }

  if (!post.meliItemId) {
    throw new BadRequestException('Este post no tiene una publicación activa en Mercado Libre.');
  }

  const token = await this.tokenRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!token) {
    throw new ForbiddenException('No hay token de Mercado Libre asociado a este usuario.');
  }

  const validToken = await this.renovarTokenSiHaceFalta(token);

  try {
    // Dar de baja publicación
    await firstValueFrom(
      this.httpService.put(
        `https://api.mercadolibre.com/items/${post.meliItemId}`,
        { status: 'closed' },
        {
          headers: {
            Authorization: `Bearer ${validToken.accessToken}`,
          },
        },
      ),
    );

    post.meliItemId = null; // o también podés guardar un estado
    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Publicación dada de baja exitosamente en Mercado Libre.',
    };
  } catch (error) {
    this.logger.error('Error al cerrar publicación en Meli', error?.response?.data || error);
    throw new Error(
      error.response?.data?.message || 'No se pudo cerrar la publicación en Mercado Libre.',
    );
  }
}

}
