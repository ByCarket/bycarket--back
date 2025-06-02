import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';

export const WsUserAuth = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const payload: JwtPayload = client.data.user;

    return data ? payload[data] : payload;
  },
);
