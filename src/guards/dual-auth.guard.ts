import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { auth } from 'express-oauth2-jwt-bearer';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

@Injectable()
export class DualAuthGuard implements CanActivate {
  private auth0Checker

  constructor(private jwtService: JwtService) {
    // Configurar el middleware de verificación de Auth0
    this.auth0Checker = auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
      tokenSigningAlg: 'RS256',
    });
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Intentar primero con nuestra JWT local
    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      request.user = user;
      return true;
    } catch (localJwtError) {
      // Si falla el JWT local, intentar con Auth0
      return new Promise((resolve, reject) => {
        this.auth0Checker(request, {}, (auth0Error) => {
          if (auth0Error) {
            // Si ambos fallan, el token no es válido
            reject(new UnauthorizedException('Invalid token'));
            return;
          }

          // La verificación Auth0 fue exitosa, el objeto auth está en request.auth
          if (request.auth && request.auth.payload) {
            request.user = {
              sub: request.auth.payload.sub,
              email: request.auth.payload.email,
              role: request.auth.payload['https://example.com/role'] || 'USER',
              auth0User: true,
            };
            resolve(true);
          } else {
            reject(new UnauthorizedException('Invalid Auth0 token payload'));
          }
        });
      });
    }
  }
}