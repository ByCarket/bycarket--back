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
import { PublicarMeliDto } from '../../DTOs/meliDto/publicar-meli.dto';

@ApiTags('Mercado Libre')
@Controller('meli')
export class MeliController {
  constructor(private readonly meliService: MeliService) {}

  @Get('auth')
  @ApiOperation({ summary: 'Redirige al usuario a Mercado Libre para autorizar la app' })
  @ApiResponse({ status: 302, description: 'Redirección hacia Mercado Libre' })
  auth(@Query('vehicleId') vehicleId: string, @Res() res: Response) {
    const url = this.meliService.getAuthUrl(vehicleId);
    return res.redirect(url);
  }

  @Get('callback')
  @ApiOperation({
    summary: 'Callback desde Mercado Libre después de la autorización',
    description: 'Guarda el token y publica el vehículo si se proporcionó vehicleId.',
  })
  @ApiResponse({ status: 200, description: 'Token guardado correctamente' })
  async callback(
    @Query('code') code: string,
    @Query('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    // En producción deberías obtener el userId del token JWT o sesión
    const userId = (req as any).user?.id || 'temporal';
    return this.meliService.getAccessToken(code, userId, vehicleId);
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
  async publicar(@Req() req, @Body() body: PublicarMeliDto) {
    const userId = req.user.id;
    return this.meliService.publicarDesdePostId(body.postId, userId);
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

}
