import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from 'src/entities/post.entity';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Estado del post',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Rejected'],
  })
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Rejected'])
  status?: PostStatus;
}
