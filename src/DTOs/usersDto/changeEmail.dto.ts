import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class ChangeEmailDto extends PickType(CreateUserDto, ['email']) {}
