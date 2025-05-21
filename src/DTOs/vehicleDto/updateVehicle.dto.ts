import { PartialType } from '@nestjs/swagger';
import { BaseVehicleDto } from './baseVehicle.dto';

export class UpdateVehicleDto extends PartialType(BaseVehicleDto) {}
