// dto/create-vehicle.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
    @IsUUID()
    brandId: string;

    @IsUUID()
    modelId: string;

    @IsUUID()
    yearOptionId: string;

    @IsNumber()
    price: number;

    @IsNumber()
    mileage: number;

    @IsString()
    @IsOptional()
    description?: string;
}
