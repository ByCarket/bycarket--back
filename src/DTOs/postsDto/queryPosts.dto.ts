import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { OrderByPostsEnum } from 'src/enums/orderByPosts.enum';
import { OrderDirectionEnum } from 'src/enums/order.enum';
import { FiltersDto } from './filters.dto';

export class QueryPostsDto extends FiltersDto {
  @IsOptional()
  @IsString()
  status?: string;
  // Pagination
  @Transform(({ value }) => value ?? 1)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => value ?? 10)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  // Order
  @IsOptional()
  @IsEnum(OrderByPostsEnum)
  orderBy: OrderByPostsEnum = OrderByPostsEnum.POST_DATE;

  @IsOptional()
  @IsEnum(OrderDirectionEnum)
  order: OrderDirectionEnum = OrderDirectionEnum.DESC;

  // Search
  @IsOptional()
  @IsString()
  search?: string;
}
