import {
  IsUUID,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateVehicleDto {
  @ApiPropertyOptional({ description: 'ID de la nueva marca', example: 'uuid' })
  @IsUUID()
  @IsOptional()
  brandId?: string;


  @ApiPropertyOptional({ description: 'ID del nuevo modelo', example: 'uuid' })
  @IsUUID()
  @IsOptional()
  modelId?: string;


  @ApiPropertyOptional({ description: 'ID de la nueva versión', example: 'uuid' })
  @IsUUID()
  @IsOptional()
  versionId?: string;


  @ApiPropertyOptional({ description: 'Año a modificar', example: 2020 })
  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  @IsOptional()
  year?: number;


  @ApiPropertyOptional({ description: 'Nuevo precio', example: 12000 })
  @IsNumber()
  @IsOptional()
  price?: number;


  @ApiPropertyOptional({ description: 'Nuevo kilometraje', example: 80000 })
  @IsNumber()
  @IsOptional()
  mileage?: number;


  @ApiPropertyOptional({ description: 'Descripción actualizada', example: 'Actualizado a GNC y servicios al día' })
  @IsString()
  @IsOptional()
  description?: string;
}


