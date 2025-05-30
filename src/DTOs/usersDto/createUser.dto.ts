import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PhoneDto } from './phone.dto';


/**
 * Base DTO for user-related operations
 * Contains all possible user properties
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{6,15}$/)
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
  @MaxLength(50)
  @ApiProperty({
    description: 'User shipping address',
    example: '123 Main Street, Apt 4B',
    type: String,
    minLength: 3,
    maxLength: 80,
  })
  address: string;

  @ValidateNested()
  @Type(() => PhoneDto)
  @ApiProperty({
    description: 'User phone number with country code, area code, and number',
    example: {
      countryCode: '+1',
      areaCode: '555',
      number: '1234567'
    },
    type: PhoneDto,
    required: true,
  })
  phone: PhoneDto;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
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
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    description: 'User city of residence',
    example: 'New York',
    type: String,
    minLength: 2,
    maxLength: 20,
  })
  city: string;
}
