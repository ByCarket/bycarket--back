import { PartialType } from '@nestjs/mapped-types';
import { CreateYearOptionDto } from 'src/dto/vehicleDto/create-year-option.dto';

export class UpdateYearOptionDto extends PartialType(CreateYearOptionDto) {}
