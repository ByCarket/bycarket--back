import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from 'src/entities/post.entity';

/**
 * Base DTO for post-related operations
 */
export class BasePostDto {
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
    example: 'Pending',
    enum: ['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'],
    default: 'Pending',
  })
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'])
  status: PostStatus;
}