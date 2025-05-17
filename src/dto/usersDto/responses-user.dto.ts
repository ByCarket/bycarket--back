import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class ResponseIdDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  data: string;

  @ApiProperty({
    description: 'Message',
    example: 'User created successfully',
  })
  message: string;
}

export class ResponsePrivateUserDto {
  @ApiProperty({
    description: 'User data without password',
    type: User,
  })
  data: Omit<User, 'password' | 'isActive'>;

  @ApiProperty({
    description: 'Message',
    example: 'User found successfully',
  })
  message: string;
}

export class ResponsePublicUserDto {
  @ApiProperty({
    description: 'User public data',
    type: User,
  })
  data: Omit<User, 'password' | 'role' | 'questions' | 'isActive'>;

  @ApiProperty({
    description: 'Message',
    example: 'User found successfully',
  })
  message: string;
}

export class ResponsePagUsersDto {
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
