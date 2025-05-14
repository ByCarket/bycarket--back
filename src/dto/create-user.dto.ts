import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @ApiProperty({
    description: 'User full name',
    example: 'John Smith',
    type: String,
    minLength: 3,
    maxLength: 80,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
  )
  @ApiProperty({
    description:
      'User password (must contain at least one uppercase letter, one lowercase letter, one number and one special character)',
    example: 'Pass@word123',
    type: String,
    minLength: 8,
    maxLength: 15,
  })
  password: string;

  @IsNotEmpty()
  @Validate(MatchPassword, ['password'])
  @ApiProperty({
    description: 'Confirmation of the password (must match password)',
    example: 'Pass@word123',
    type: String,
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @ApiProperty({
    description: 'User shipping address',
    example: '123 Main Street, Apt 4B',
    type: String,
    minLength: 3,
    maxLength: 80,
  })
  address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User phone number',
    example: 1234567890,
    type: Number,
  })
  phone: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    description: 'User country of residence',
    example: 'United States',
    type: String,
    minLength: 5,
    maxLength: 20,
  })
  country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({
    description: 'User city of residence',
    example: 'New York',
    type: String,
    minLength: 5,
    maxLength: 20,
  })
  city: string;
}
