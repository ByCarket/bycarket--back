import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class ResponsePaginatedUsersDto {
  @ApiProperty({
    description: 'Array of users without password',
    type: [User],
  })
  data: Omit<User, 'password'>[];

  @ApiProperty({
    description: 'Total number of users',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of users per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}