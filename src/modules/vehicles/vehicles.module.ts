import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';

@Module({
  providers: [VehiclesService],
  controllers: [VehiclesController]
})
export class VehiclesModule {}
