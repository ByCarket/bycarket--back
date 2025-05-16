import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { Brand } from '../../entities/brand.entity';
import { Model } from '../../entities/model.entity';
import { Version } from '../../entities/version.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Model, Version, User, Post]), AuthModule],
  controllers: [SeederController],
  providers: [SeederService, UsersService],
})
export class SeederModule {}
