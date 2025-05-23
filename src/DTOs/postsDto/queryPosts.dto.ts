import { Transform, Type } from 'class-transformer';
import {
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
import { CurrencyEnum } from 'src/enums/currency.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { VehicleTypeEnum } from 'src/enums/vehicleType.enum';

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

  // Search
  @IsOptional()
  @IsString()
  search?: string;

  // Exact filters
  @IsOptional()
  @IsString()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  modelId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  versionId?: string;

  @IsOptional()
  @IsEnum(VehicleTypeEnum)
  typeOfVehicle?: VehicleTypeEnum;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;

  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency?: CurrencyEnum;

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
