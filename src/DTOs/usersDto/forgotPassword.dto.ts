import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class ForgotPasswordDto extends PickType(CreateUserDto, ['email']){}