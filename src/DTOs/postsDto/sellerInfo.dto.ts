import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../usersDto/createUser.dto';

export class SellerInfoDto extends PickType(CreateUserDto, ['name', 'phone']) {
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
