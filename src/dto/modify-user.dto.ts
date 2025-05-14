import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ModifyUserDto extends PartialType(CreateUserDto) {
  orders?: { id: string; date: Date }[];
}
