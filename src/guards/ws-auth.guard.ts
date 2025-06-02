import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    if (!client.handshake || !client.handshake.auth) {
      throw new UnauthorizedException('No handshake or auth data provided');
    }

    const token = client.handshake.auth.token;
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const secret = process.env.JWT_SECRET;
      const payload = await this.jwtService.verify(token, { secret });

      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);

      client.data.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }
}
