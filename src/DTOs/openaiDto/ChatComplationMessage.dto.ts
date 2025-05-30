import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString } from 'class-validator';



export class ChatComplationMessageDto {
  @ApiProperty({ example: 'user', enum: ['system', 'user', 'assistant'] })
  @IsString()
  @IsNotEmpty()
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({ example: '¡Hola! que tal es el auto Ford Focus SE AT 2018?', description: 'Contenido del mensaje' })
  @IsString()
  @IsNotEmpty()
  content: string;
}