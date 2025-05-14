import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class ModifyUserDto extends OmitType(PartialType(CreateUserDto), [
  'email',
  'password',
  'confirmPassword',
] as const) {}
