import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { YearOption } from 'src/entities/year.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'; 

import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Brand, Model, YearOption, User, Post]),
    AuthModule,
    UsersModule, 
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService], 
})
export class VehiclesModule {}
