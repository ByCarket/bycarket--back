import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/post.entity';

export class ResponsePaginatedPostsDto {
  @ApiProperty({
    description: 'Array of posts',
    type: [Post],
  })
  data: Omit<Post, 'user'>[];

  @ApiProperty({
    description: 'Total number of posts',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of posts per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}