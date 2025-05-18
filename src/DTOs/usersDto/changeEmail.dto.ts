import { ApiProperty ,PickType } from '@nestjs/swagger';
import { BaseUserDto } from './baseUsers.dto';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeEmailDto extends PickType(BaseUserDto, ['email']) {
  @ApiProperty({
    description: 'New email address',
    example: 'john.smith@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  newEmail: string;
}