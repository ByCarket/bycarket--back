import { PartialType } from '@nestjs/mapped-types';
import { CreateModelDto } from 'src/dto/vehicleDto/create-model.dto';

export class UpdateModelDto extends PartialType(CreateModelDto) {}
