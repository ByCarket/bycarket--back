import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from 'src/DTOs/vehicleDto/seederDto/create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
