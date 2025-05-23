import { PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BaseVehicleDto } from '../vehicleDto/baseVehicle.dto';
import { OrderByPostsEnum } from 'src/enums/orderByPosts.enum';
import { OrderDirectionEnum } from 'src/enums/order.enum';

export class QueryPostsDto extends PickType(PartialType(BaseVehicleDto), [
  'brandId',
  'modelId',
  'versionId',
  'typeOfVehicle',
  'condition',
  'currency',
]) {
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

  // Range Filters
  @IsOptional()
  @Type(() => Number)
  @Min(1950)
  @IsInt()
  minYear?: number;
  @IsOptional()
  @Type(() => Number)
  @Max(new Date().getFullYear())
  @IsInt()
  maxYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsInt()
  minPrice?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minMileage?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxMileage?: number;
}
