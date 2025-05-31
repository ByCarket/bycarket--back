import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,3}$/, { message: 'Country code must start with + and have 1-3 digits' })
  @ApiProperty({
    description: 'Country code with + prefix',
    example: '+1',
    type: String,
  })
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2,4}$/, { message: 'Area code must have 2-4 digits' })
  @ApiProperty({
    description: 'Area code (2-4 digits)',
    example: '555',
    type: String,
  })
  areaCode: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,10}$/, { message: 'Phone number must have 4-10 digits' })
  @ApiProperty({
    description: 'Phone number (4-10 digits)',
    example: '1234567',
    type: String,
  })
  number: string;
}