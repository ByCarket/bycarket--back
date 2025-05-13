
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Brand } from 'src/entities/brand.entity';
import { Model } from 'src/entities/model.entity';
import { YearOption } from 'src/entities/year.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Brand, Model, YearOption]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
