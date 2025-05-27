import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OpenAiService } from './openai.service';
import { GenerateTextDto } from '../../DTOs/openaiDto/generateText.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/enums/roles.enum';

@ApiTags('OpenAI')
@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('generate-description')
  @ApiOperation({ summary: 'Generar descripción de vehículo con IA' })
  @ApiResponse({ status: 201, description: 'Descripción generada exitosamente' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PREMIUM)
  async generate(@Body() dto: GenerateTextDto) {
    const description = await this.openAiService.generateDescription(dto.description);
    return { description };
  }
}
