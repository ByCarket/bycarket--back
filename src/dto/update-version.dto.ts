import { PartialType } from '@nestjs/mapped-types';
import { CreateVersionDto } from './create-version.dto';

export class UpdateVersionDto extends PartialType(CreateVersionDto) {}
