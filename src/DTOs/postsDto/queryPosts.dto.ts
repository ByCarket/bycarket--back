import { PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { OrderByPostsEnum } from 'src/enums/orderByPosts.enum';
import { OrderDirectionEnum } from 'src/enums/order.enum';
import { VehicleTypeEnum } from 'src/enums/vehicleType.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { CurrencyEnum } from 'src/enums/currency.enum';

export class QueryPostsDto {
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

  // Exact Filters
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  brandId?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  modelId?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  versionId?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(VehicleTypeEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  typeOfVehicle?: VehicleTypeEnum[];

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

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
