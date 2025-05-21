import { PartialType } from '@nestjs/mapped-types';
import { CreateVersionDto } from 'src/DTOs/vehicleDto/seederDto/create-version.dto';

export class UpdateVersionDto extends PartialType(CreateVersionDto) {}
