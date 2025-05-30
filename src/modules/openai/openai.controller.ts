import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OpenAiService } from './openai.service';
import { GenerateTextDto } from '../../DTOs/openaiDto/generateText.dto';
import { createChatCompletionRequestDto } from 'src/DTOs/openaiDto/createChatCompletion-request.dto';

@ApiTags('OpenAI')
@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('generate-description')
  @ApiOperation({ summary: 'Generar descripción de vehículo con IA' })
  @ApiResponse({ status: 201, description: 'Descripción generada exitosamente' })
  async generate(@Body() dto: GenerateTextDto) {
    const description = await this.openAiService.generateDescription(dto.description);
    return { description };
  }

 @Post('chatCompletion')
@ApiOperation({ summary: 'Chat de preguntas sobre el vehículo' })
@ApiResponse({ status: 200, description: 'Respuesta del chatbot' })
async createChatCompletion(@Body() body: createChatCompletionRequestDto) {
  const { messages, postId } = body;
  const response = await this.openAiService.createChatCompletion(messages, postId);
  return { response };
}
}
