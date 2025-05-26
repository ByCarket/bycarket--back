import { ApiProperty, PickType } from '@nestjs/swagger';
import { BasePostDto } from './basePosts.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(BasePostDto, ['vehicleId'] as const) {
  @ApiProperty({
    description: 'Posible descripcion nueva del vehiculo',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}
