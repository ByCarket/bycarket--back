import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GenerateTextDto {
  @ApiProperty({
    description: 'Texto base con información del vehículo para generar una descripción',
    example: 'Renault Sandero 2019 full, 70.000 km, excelente estado, único dueño, motor 1.6.'
  })
  @IsString()
  @MinLength(10)
  description: string;
}
