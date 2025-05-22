import { BaseVehicleDto } from 'src/DTOs/vehicleDto/baseVehicle.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateVehicleImgDto extends PickType(BaseVehicleDto, ['images'] as const) {}