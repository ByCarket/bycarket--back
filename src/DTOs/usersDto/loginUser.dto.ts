import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from './baseUsers.dto';

export class LoginUserDto extends PickType(BaseUserDto, [
  'email',
  'password',
]) {}