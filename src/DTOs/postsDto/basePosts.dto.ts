import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from 'src/enums/postStatus.enum';

/**
 * Base DTO for post-related operations
 */
export class BasePostDto {
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID del vehículo que se está vendiendo',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  vehicleId: string;
}
