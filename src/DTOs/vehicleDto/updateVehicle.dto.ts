import { PartialType, OmitType } from '@nestjs/swagger';
import { BaseVehicleDto } from './baseVehicle.dto';

export class UpdateVehicleDto extends OmitType(PartialType(BaseVehicleDto), ['brandId', 'modelId', 'versionId', 'images']) {}
