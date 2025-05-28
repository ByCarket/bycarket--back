import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
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
}

