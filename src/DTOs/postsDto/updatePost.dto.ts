import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/swagger';
import { BasePostDto } from './basePosts.dto';
import { PostStatus } from 'src/entities/post.entity';
import { IsEnum } from 'class-validator';


export class UpdatePostDto extends PickType(BasePostDto, ['status']) {
  @ApiProperty({
    description: 'Estado del post',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'],
  })
  @IsOptional()
  @IsEnum(['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'])
  newStatus?: PostStatus;
}