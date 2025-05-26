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
import { MeliToken } from '../../entities/meliToken.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { TestUser } from 'src/entities/testUser.entity';


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
    @InjectRepository(TestUser)
    private readonly testUserRepository: Repository<TestUser>,

    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('MELI_CLIENT_ID') ?? (() => { throw new Error('MELI_CLIENT_ID is not set'); })();
    this.clientSecret = this.configService.get<string>('MELI_CLIENT_SECRET') ?? (() => { throw new Error('MELI_CLIENT_SECRET is not set'); })();
    this.redirectUri = this.configService.get<string>('MELI_REDIRECT_URI') ?? (() => { throw new Error('MELI_REDIRECT_URI is not set'); })();
  }

getAuthUrl() {
  return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
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
  return {
    message: 'Token guardado correctamente.',
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
      relations: {user:true, vehicle:{brand:true, model:true, version:true}},
    });
  console.log('Viendo que tiene post: ', post)
  console.log('Viendo que tiene userId: ', userId)
  console.log('Viendo que tiene post.user.id: ', post?.user?.id)
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
    // console.log('Viendo que tiene itemData: ', itemData)

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
    category_id: 'MLA1743', // o ajustá a la categoría "leaf" correcta!
    price: vehicle.price,
    currency_id: 'ARS',
    available_quantity: 1,
    buying_mode: 'classified',  // OJO: según error de ML, debe ser 'classified' en MLA1743
    condition: 'used',
    listing_type_id: 'free', // revisá cuál corresponde según ML para test user
    pictures: vehicle.images.map((img) => ({ source: img.secure_url })),
    attributes: [
      { id: 'BRAND', value_name: vehicle.brand.name },
      { id: 'MODEL', value_name: vehicle.model.name },
      { id: 'VEHICLE_YEAR', value_name: vehicle.year.toString() },
      { id: 'TRANSMISSION', value_name: vehicle.transmission || 'Manual' },
    ],
    description: { plain_text: vehicle.description },
    location: {
      country: { name: vehicle.country },
      state: { name: vehicle.state },
      city: { name: vehicle.city },
    },
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

// src/modules/meli/meli.service.ts

async createTestUser(type: 'seller' | 'buyer') {
  const data = { site_id: 'MLA' };

  // 🔴 Ajuste: usa el access token de tu app (no el clientId)
  // const appAccessToken = this.configService.get<string>('MELI_APP_ACCESS_TOKEN') ?? (() => { throw new Error('MELI_APP_ACCESS_TOKEN is not set'); })();
const { access_token: appAccessToken } = await this.generateAppAccessToken();
  const response = await firstValueFrom(
    this.httpService.post('https://api.mercadolibre.com/users/test_user', data, {
      headers: {
        Authorization: `Bearer ${appAccessToken}`,
      },
    }),
  );

  const { id, nickname, password } = response.data;

  // Guardalo en la DB
  const testUser = this.testUserRepository.create({
    meliUserId: id,
    nickname,
    password,
    type,
  });
  await this.testUserRepository.save(testUser);

  return {
    message: 'Usuario de prueba creado correctamente.',
    testUser,
  };
  
}

async generateAppAccessToken(): Promise<{ access_token: string }> {
  const data = {
    grant_type: 'client_credentials',
    client_id: this.clientId,
    client_secret: this.clientSecret,
  };

  const response = await firstValueFrom(
    this.httpService.post('https://api.mercadolibre.com/oauth/token', qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  );

  const { access_token } = response.data;

  return { access_token };
}


}
