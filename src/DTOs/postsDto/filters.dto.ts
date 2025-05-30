import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { CurrencyEnum } from 'src/enums/currency.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { VehicleTypeEnum } from 'src/enums/vehicleType.enum';

export class FiltersDto {
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
