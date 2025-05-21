import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';

export const UserAuthenticated = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    return data ? user[data] : user;
  },
);
