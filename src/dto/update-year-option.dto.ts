import { PartialType } from '@nestjs/mapped-types';
import { CreateYearOptionDto } from './create-year-option.dto';

export class UpdateYearOptionDto extends PartialType(CreateYearOptionDto) {}
