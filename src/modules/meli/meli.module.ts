// src/modules/meli/meli.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeliController } from './meli.controller';
import { MeliService } from './meli.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { Post } from '../../entities/post.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { User } from '../../entities/user.entity';
import { MeliToken } from '../../entities/meliToken.entity';
import { TestUser } from 'src/entities/testUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Vehicle, User, MeliToken, TestUser]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [MeliController],
  providers: [MeliService],
})
export class MeliModule {}
