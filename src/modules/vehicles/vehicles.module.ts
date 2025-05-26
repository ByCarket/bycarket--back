import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'; 
import { FilesModule } from '../files/files.module';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Version } from 'src/entities/version.entity';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Brand, Model, User, Post, Version]), AuthModule, UsersModule, FilesModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, cloudinaryConfig], 
})
export class VehiclesModule {}
