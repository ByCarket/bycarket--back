import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from 'src/dto/vehicleDto/create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
