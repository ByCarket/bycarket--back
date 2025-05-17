import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from 'src/entities/post.entity';
import { Type } from 'class-transformer';

class VehicleDetail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brand: {
    id: string;
    name: string;
  };

  @ApiProperty()
  model: {
    id: string;
    name: string;
  };

  @ApiProperty()
  yearOption: {
    id: string;
    year: number;
  };

  @ApiProperty()
  price: number;

  @ApiProperty()
  mileage: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  photos: string[];
}

class UserDetail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: number;
}

class PostDetail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Type(() => UserDetail)
  user: UserDetail;

  @ApiProperty()
  @Type(() => VehicleDetail)
  vehicle: VehicleDetail;

  @ApiProperty()
  postDate: Date;

  @ApiProperty({
    enum: ['Active', 'Inactive', 'Rejected'],
  })
  status: PostStatus;
}

export class ResponsePostDto {
  @ApiProperty()
  data: PostDetail;

  @ApiProperty({ example: 'Post found successfully.' })
  message: string;
}

export class ResponseIdDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  data: string;

  @ApiProperty({ example: 'Post created successfully.' })
  message: string;
}

export class ResponsePagPostsDto {
  @ApiProperty({ type: [PostDetail] })
  data: PostDetail[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
