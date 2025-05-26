// src/modules/meli/meli.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { MeliService } from './meli.service';
import { Request, Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicarMeliDto } from '../../DTOs/meliDto/publicarMeli.dto';
import { ConfigService } from '@nestjs/config';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';

@ApiTags('Mercado Libre')
@Controller('meli')
export class MeliController {
  constructor(private readonly meliService: MeliService,
    private readonly configService: ConfigService,
  ) {}

  @Get('auth')
  @ApiOperation({ summary: 'Redirige al usuario a Mercado Libre para autorizar la app' })
  @ApiResponse({ status: 302, description: 'Redirección hacia Mercado Libre' })
  auth(@Res() res: Response) {
    const url = this.meliService.getAuthUrl();
    return res.redirect(url);
  }
  // src/modules/meli/meli.controller.ts

@Get('auth/test')
@ApiOperation({ summary: 'Prueba de autorización con Mercado Libre' })
@ApiResponse({ status: 302, description: 'Redirección a Mercado Libre para autorización' })
authTest(@Res() res: Response) {
  const url = this.meliService.getAuthUrl();
  return res.redirect(url);
}


@Get('callback')
// @UseGuards(AuthGuard)
@ApiOperation({
  summary: 'Callback desde Mercado Libre después de la autorización',
  description: 'Guarda el token ',
})
@ApiResponse({ status: 200, description: 'Token guardado correctamente' })
async callback(
  @Query('code') code: string,
  @Req() req: Request,
) {

const userId = (req as any).user?.id || this.configService.get<string>('TEST_USER_ID') // Aquí deberías obtener el ID del usuario autenticado
  // Si estás usando un guard de autenticación, puedes obtener el userId del objeto req.user, pero si no, en desarrollo puedes usar un ID de usuario fijo para pruebas.
  // Asegúrate de que el userId sea válido y esté asociado al usuario que está haciendo la solicitud.
  
  if (!code || !userId) {
  
    throw new Error(`Faltan parámetros en el callback,${code},${userId}`);
  }

  return this.meliService.getAccessToken(code, userId);
}



  @Post('publicar')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publica un vehículo en Mercado Libre a partir del postId' })
  @ApiBody({ type: PublicarMeliDto })
  @ApiResponse({
    status: 200,
    description: 'Publicación realizada correctamente o respuesta de error si falla.',
    schema: {
      example: {
        success: true,
        meliItemId: 'MLA123456789',
        permalink: 'https://articulo.mercadolibre.com.ar/MLA-123456789...',
        message: 'Publicación creada exitosamente.',
      },
    },
  })
  
  async publicar(@UserAuthenticated('sub') userId: string, @Body() body: PublicarMeliDto) {
    // const userId = req.user.id;
    // const userId = req.user.sub
    return {status: 'ok', data: await this.meliService.publicarDesdePostId(body.postId, userId)};
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook para recibir eventos de Mercado Libre (opcional)' })
  @ApiResponse({ status: 200, description: 'Evento recibido' })
  webhook(@Body() data: any) {
    console.log('📦 Webhook recibido desde Mercado Libre:', data);
    return { status: 'ok' };
  }

  @Delete(':postId')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Dar de baja una publicación en Mercado Libre por postId' })
@ApiResponse({
  status: 200,
  description: 'La publicación fue dada de baja exitosamente',
  schema: {
    example: {
      success: true,
      message: 'Publicación dada de baja exitosamente en Mercado Libre.',
    },
  },
})
@ApiResponse({ status: 400, description: 'El post no está vinculado a una publicación de Meli' })
@ApiResponse({ status: 403, description: 'Token no vinculado o inválido' })
@ApiResponse({ status: 401, description: 'No autorizado' })
async eliminar(@Req() req, @Param('postId') postId: string) {
  const userId = req.user.id;
  return this.meliService.eliminarPublicacion(postId, userId);
}
@Post('create-test-user')
@ApiOperation({ summary: 'Crea un usuario de prueba (test user) en Mercado Libre' })
@ApiBody({
  schema: {
    example: {
      type: 'seller', // o 'buyer'
    },
  },
})
async createTestUser(@Body('type') type: 'seller' | 'buyer') {
  return this.meliService.createTestUser(type);
}
@Get('generate-app-token')
@ApiOperation({ summary: 'Genera el APP_ACCESS_TOKEN de la aplicación' })
@ApiResponse({
  status: 200,
  description: 'Token generado correctamente.',
  schema: {
    example: {
      access_token: 'APP_USR-1234567890-052422-abcdef',
    },
  },
})
async generateAppToken() {
  return this.meliService.generateAppAccessToken();
}

}
