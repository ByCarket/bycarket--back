import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwtPayload.type';

export const UserAuthenticated = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    return data ? user[data] : user;
  },
);
