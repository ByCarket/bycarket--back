import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ChatComplationMessageDto } from './ChatComplationMessage.dto';

export class createChatCompletionRequestDto {
  @ApiProperty({
    description: 'Lista de mensajes para la conversación',
    type: [ChatComplationMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatComplationMessageDto)
  messages: ChatComplationMessageDto[];

  @ApiProperty({
    description: 'UUID del post del vehículo para responder preguntas',
    example: '3cc34d6f-ed50-4d3e-a3b0-85ce32420a73',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}
