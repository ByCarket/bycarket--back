// src/modules/vehicles/dto/create-vehicle.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
    @ApiProperty({ example: 'uuid-de-brand', description: 'ID de la marca asociada' })
    @IsUUID()
    brandId: string;

    @ApiProperty({ example: 'uuid-de-model', description: 'ID del modelo asociado' })
    @IsUUID()
    modelId: string;

    @ApiProperty({ example: 'uuid-de-year-option', description: 'ID del año asociado' })
    @IsUUID()
    yearOptionId: string;

    @ApiProperty({ example: 15000, description: 'Precio del vehículo' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 50000, description: 'Kilometraje del vehículo' })
    @IsNumber()
    mileage: number;

    @ApiProperty({ example: 'Vehículo en excelente estado', description: 'Descripción opcional' })
    @IsString()
    @IsOptional()
    description?: string;
}