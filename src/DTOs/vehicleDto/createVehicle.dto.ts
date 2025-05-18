import { PartialType } from '@nestjs/swagger';
import { BaseVehicleDto } from './baseVehicle.dto';

export class CreateVehicleDto extends PartialType(BaseVehicleDto) {}