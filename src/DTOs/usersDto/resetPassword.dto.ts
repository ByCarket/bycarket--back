import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class ResetPasswordDto extends PickType(CreateUserDto, ['password', 'confirmPassword']) {
  token: string;
}
