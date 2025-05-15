/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequired = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequired) return true;

    const request = context.switchToHttp().getRequest();
    const { sub } = request.user as JwtPayload;

    const { data } = await this.usersService.getMyUser(sub);
    const hasRole = () => rolesRequired.some(role => data.role?.includes(role));
    const isValid = data && data.role && hasRole();

    if (!isValid)
      throw new ForbiddenException(
        "You don't have permission and aren't allowed to access this route.",
      );
    return isValid;
  }
}
