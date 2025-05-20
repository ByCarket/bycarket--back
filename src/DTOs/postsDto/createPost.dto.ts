import { PickType } from '@nestjs/swagger';
import { BasePostDto } from './basePosts.dto';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto extends PickType(BasePostDto, ['vehicleId', 'userId'] as const) {
    @ApiProperty({
      description: 'ID del vehículo que se está vendiendo',
      example: '123e4567-e89b-12d3-a456-426614174001',
    })
    @IsUUID()
    vehicleId: string;
}