import { PartialType } from '@nestjs/swagger';
import { BaseVehicleDto } from './baseVehicle.dto';

export class VehicleDetailDto extends PartialType(BaseVehicleDto) {}