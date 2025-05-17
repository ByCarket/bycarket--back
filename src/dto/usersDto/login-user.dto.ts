import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/usersDto/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
