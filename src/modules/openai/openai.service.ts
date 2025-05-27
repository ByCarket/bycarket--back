import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // async generateDescription(description: string): Promise<string> {
  //   try {
  //     const chatCompletion = await this.openai.chat.completions.create({
  //       model: 'gpt-3.5-turbo',
  //       messages: [
  //         {
  //           role: 'system',
  //           content: 'Actúa como un redactor de una concesionaria. Tu tarea es escribir una descripción breve, atractiva y profesional para publicar un auto en venta.'
  //         },
  //         {
  //           role: 'user',
  //           content: description,
  //         },
  //       ],
  //       temperature: 0.7,
  //       max_tokens: 250,
        
  //     });

  //     return chatCompletion.choices[0]?.message?.content?.trim() || '';
  //   } catch (error) {
  //     console.error('Error en OpenAI:', error);
  //     throw new InternalServerErrorException('Error generando descripción con IA');
  //   }
  // }


async generateDescription(description: string): Promise<string> {
  return `Simulación IA: Descripción generada para -> ${description}`;
}
}