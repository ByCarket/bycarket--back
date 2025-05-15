import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';
import { Auth0Strategy } from './auth0.strategy';
import { Auth0JwtStrategy } from './auth0-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [Auth0Controller],
  providers: [Auth0Service, Auth0Strategy, Auth0JwtStrategy],
  exports: [Auth0Service],
})
export class Auth0Module {}