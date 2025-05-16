import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Post])],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
