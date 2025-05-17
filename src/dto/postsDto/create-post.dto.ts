import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from 'src/entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'ID del usuario que crea el post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID del vehículo que se está vendiendo',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({
    description: 'Estado del post',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Rejected'],
    default: 'Active',
  })
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Rejected'])
  status?: PostStatus;
}
