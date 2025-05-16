import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, User, Post]), AuthModule, UsersModule],
  providers: [BrandsService],
  controllers: [BrandsController],
})
export class BrandsModule {}
