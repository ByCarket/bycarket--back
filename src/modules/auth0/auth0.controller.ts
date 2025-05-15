import { Controller, Get, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth0Service } from './auth0.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth0')
@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Iniciar el flujo de login con Auth0' })
  async login() {
    // Este endpoint redirige al usuario a Auth0
    // La lógica se maneja en el guardián 'auth0'
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  @ApiOperation({ summary: 'Callback de Auth0 después del login' })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente con Auth0',
  })
  async callback(@Req() req, @Res() res: Response) {
    // El usuario regresa de Auth0 después de autenticarse
    const user = await this.auth0Service.processAuth0User(req.user);
    
    // Redirigir a tu frontend con el token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?token=${req.user.accessToken}`,
    );
  }

  @Post('token-exchange')
  @UseGuards(AuthGuard('auth0-jwt'))
  @ApiOperation({ summary: 'Intercambiar token de Auth0 por información del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Token verificado y usuario obtenido',
  })
  async tokenExchange(@Req() req) {
    // Esta ruta permite a tu frontend verificar un token Auth0
    // y sincronizar el usuario con tu sistema
    const user = await this.auth0Service.processAuth0User(req.user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Auth0 token verificado correctamente',
    };
  }
}
