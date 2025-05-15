/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequired = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolesRequired) return true;

    const request = context.switchToHttp().getRequest();
    const { sub } = request.user as JwtPayload;

    const user = await this.usersRepository.findOneBy({ id: sub });
    const hasRole = () => rolesRequired.some(role => user?.role?.includes(role));
    const isValid = user && user.role && hasRole();

    if (!isValid)
      throw new ForbiddenException(
        "You don't have permission and aren't allowed to access this route.",
      );
    return isValid;
  }
}
