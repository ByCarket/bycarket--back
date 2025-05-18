import { OmitType, PartialType } from '@nestjs/swagger';
import { BaseUserDto } from './baseUsers.dto';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserInfoDto extends OmitType(PartialType(BaseUserDto), [
  'name',
  'address',
  'phone',
  'country',
  'city',
] as const) {
  @ApiProperty({
    description: 'New email address',
    example: 'john.smith@example.com',
    type: String,
  })
  @IsEmail()
  @IsString()
  @MaxLength(100)
  @IsOptional() // This field is optional
  newEmail?: string;

  @ApiProperty({
    description: 'New phone number',
    example: 1234567890,
    type: Number,
  })
  @IsString()
  @MaxLength(15)
  @IsOptional() // This field is optional
  newPhone?: number;

  @ApiProperty({
    description: 'New address',
    example: '123 Main St, Springfield, USA',
    type: String,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional() // This field is optional
  newAddress?: string;

  @ApiProperty({
    description: 'New country',
    example: 'USA',
    type: String,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional() // This field is optional
  newCountry?: string;

  @ApiProperty({
    description: 'New city',
    example: 'Springfield',
    type: String,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional() // This field is optional
  newCity?: string;
}