import { PartialType, PickType } from '@nestjs/swagger';
import { BaseUserDto } from './baseUsers.dto';
import { IsEmail, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserInfoDto extends PickType(PartialType(BaseUserDto), [
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
  email?: string;

  @ApiProperty({
    description: 'New phone number',
    example: 1234567890,
    type: Number,
  })
  @IsNumber()
  @IsOptional() // This field is optional
  phone?: number;

  @ApiProperty({
    description: 'New address',
    example: '123 Main St, Springfield, USA',
    type: String,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional() // This field is optional
  address?: string;

  @ApiProperty({
    description: 'New country',
    example: 'USA',
    type: String,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional() // This field is optional
  country?: string;

  @ApiProperty({
    description: 'New city',
    example: 'Springfield',
    type: String,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional() // This field is optional
  city?: string;
}