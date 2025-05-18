import {
  IsUUID,
  IsNumber,
  IsString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Base DTO for vehicle-related operations
 * Contains all possible vehicle properties
 */
export class BaseVehicleDto {
  @ApiProperty({ description: 'ID de la marca (Brand)', example: 'uuid' })
  @IsUUID()
  brandId: string;

  @ApiProperty({ description: 'ID del modelo (Model)', example: 'uuid' })
  @IsUUID()
  modelId: string;

  @ApiProperty({ description: 'ID de la versión (Version)', example: 'uuid' })
  @IsUUID()
  versionId: string;

  @ApiProperty({ description: 'Año del vehículo', example: 2022 })
  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({ description: 'Precio del vehículo', example: 15000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Kilometraje del vehículo', example: 90000 })
  @IsNumber()
  mileage: number;

  @ApiProperty({ description: 'Descripción del vehículo', example: 'Muy buen estado, único dueño.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class BaseVehicleDetailDto {
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