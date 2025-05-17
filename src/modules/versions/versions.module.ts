import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from 'src/entities/version.entity';
import { Model } from 'src/entities/model.entity';
import { VersionsService } from './versions.service';
import { VersionsController } from './versions.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Version, Model, User, Post]), AuthModule, UsersModule],
  providers: [VersionsService],
  controllers: [VersionsController],
})
export class VersionsModule {}
