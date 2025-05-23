import {
  IsUUID,
  IsNumber,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleTypeEnum } from 'src/enums/vehicleType.enum';
import { VehicleCondition } from 'src/enums/vehicleCondition.enum';
import { CurrencyEnum } from 'src/enums/currency.enum';
import { TransmissionType } from '../../enums/transmission.enum';
import { Transform } from 'class-transformer';

/**
 * Base DTO for vehicle-related operations
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

  @ApiProperty({ description: 'Tipo de vehículo', example: 'SUV' })
  @IsEnum(VehicleTypeEnum)
  typeOfVehicle: VehicleTypeEnum;

  @ApiProperty({ description: 'Año del vehículo', example: 2022 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({ description: 'Condición del vehículo', example: 'new' })
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @ApiPropertyOptional({
    enum: TransmissionType,
    example: TransmissionType.MANUAL,
    description: 'Tipo de transmisión del vehículo',
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmission?: TransmissionType;

  @ApiProperty({ description: 'Moneda del vehículo', example: 'U$D' })
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @ApiProperty({ description: 'Precio del vehículo', example: 15000 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Kilometraje del vehículo', example: 90000 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  mileage: number;

  @ApiProperty({ description: 'Descripción del vehículo', example: 'Muy buen estado, único dueño.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Imágenes del vehículo en formato file',
  })
  images?: Express.Multer.File[];
}
