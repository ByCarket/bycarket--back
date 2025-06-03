import { ApiProperty, PickType } from '@nestjs/swagger';
import { BasePostDto } from './basePosts.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(BasePostDto, ['vehicleId'] as const) {
  @ApiProperty({
    description: 'Posible descripcion nueva del vehiculo',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Posible descripcion nueva del vehiculo',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Indica si el post es negociable',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isNegotiable: boolean;
}
