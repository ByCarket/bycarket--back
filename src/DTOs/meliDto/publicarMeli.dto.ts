// src/modules/meli/dto/publicarMeli.dto.ts

import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PublicarMeliDto {
  @ApiProperty({
    description: 'ID del post que contiene la información del vehículo a publicar',
    example: '9c7f23f4-0e26-42b4-b1b7-8c13e9f49123',
  })
  @IsNotEmpty({ message: 'El campo postId es obligatorio' })
  @IsUUID('4', { message: 'El postId debe ser un UUID válido' })
  postId: string;
}
