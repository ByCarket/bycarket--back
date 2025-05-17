import { PartialType } from '@nestjs/mapped-types';
import { CreateVersionDto } from 'src/dto/vehicleDto/create-version.dto';

export class UpdateVersionDto extends PartialType(CreateVersionDto) {}
