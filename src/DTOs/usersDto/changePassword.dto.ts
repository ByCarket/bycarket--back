import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './baseUsers.dto';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto extends PickType(BaseUserDto, ['password', 'confirmPassword']) {
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
