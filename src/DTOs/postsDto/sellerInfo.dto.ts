import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../usersDto/baseUsers.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SellerInfoDto extends PickType(BaseUserDto, ['name', 'phone']) {
  @ApiProperty({
    description: 'Nombre del vendedor',
    example: 'Ana Gómez',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Teléfono del vendedor',
    example: '987654321',
    type: Number,
  })
  phone: number;
}