import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UpdateUserInfoDto extends OmitType(PartialType(CreateUserDto), [
  'email',
  'password',
  'confirmPassword',
] as const) {}
