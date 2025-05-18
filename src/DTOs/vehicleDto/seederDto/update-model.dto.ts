import { PartialType } from '@nestjs/mapped-types';
import { CreateModelDto } from 'src/DTOs/vehicleDto/seederDto/create-model.dto';

export class UpdateModelDto extends PartialType(CreateModelDto) {}
