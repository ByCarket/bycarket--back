import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './createUser.dto';

export class ChangePasswordDto extends PickType(CreateUserDto, ['password', 'confirmPassword']) {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{6,15}$/)
  @ApiProperty({
    description:
      'User password (must contain at least one uppercase letter, one lowercase letter, one number and one special character)',
    example: 'Pass@word123',
    type: String,
    minLength: 8,
    maxLength: 15,
  })
  oldPassword: string;
}
