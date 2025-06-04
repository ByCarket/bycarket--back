import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { ChatComplationMessageDto } from 'src/DTOs/openaiDto/ChatComplationMessage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { queryPosts } from './tools/queryPosts';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Genera una descripción atractiva y profesional para un vehículo.
   */
  async generateDescription(description: string): Promise<string> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
Eres un redactor especializado en el sector automotor, trabajando para una concesionaria profesional. 
Tu tarea es tomar una descripción escrita por un usuario (posiblemente informal o desordenada) 
y transformarla en un texto breve, atractivo y persuasivo, ideal para una publicación de venta de autos online.

Haz que la descripción:
- Destaque los atributos más importantes del vehículo (marca, modelo, año, estado, equipamiento, etc.).
- Utilice un tono profesional y confiable, pero cercano.
- Sea clara, directa y sin redundancias.
- No incluya datos técnicos irrelevantes ni exageraciones.
- No inventes información que no esté en el mensaje del usuario.

Devuelve únicamente la nueva descripción mejorada.`
,
          },
          {
            role: 'user',
            content: description,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      });

      return chatCompletion.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Error en OpenAI:', error);
      throw new InternalServerErrorException('Error generando descripción con IA');
    }
  }

  /**
   * La función real que consulta los datos del vehículo en la base de datos
   */
  private async getVehicleDetails(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['vehicle', 'vehicle.model', 'vehicle.brand', 'vehicle.version'],
    });

    if (!post || !post.vehicle) return 'No se encontró el vehículo.';

    const vehicle = post.vehicle;

    return {
      postId: post.id,
      postDate: post.postDate,
      status: post.status,
      brand: vehicle.brand?.name,
      model: vehicle.model?.name,
      version: vehicle.version?.name,
      year: vehicle.year,
      mileage: vehicle.mileage,
      // Agrega aquí más campos si quieres
    };
  }

  /**
   * Chat principal que maneja las herramientas y la respuesta
   */
 async createChatCompletion(
  messages: ChatComplationMessageDto[],
  postId: string
): Promise<any> {
  try {
    // 👇 Inyectamos un mensaje "system" con el postId que el usuario está viendo
    const systemMessage: ChatComplationMessageDto = {
      role: 'system',
      content: `El postId del vehículo que el usuario está viendo es: ${postId}`,
    };

    // 👇 Lo agregamos como primer mensaje en la conversación
    const fullMessages = [systemMessage, ...messages];

    // 1️⃣ Llamada inicial a OpenAI con tools
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: fullMessages as ChatCompletionMessageParam[],
      tools: [queryPosts],
      tool_choice: 'auto',
    });

    const message = response.choices[0].message;

    // 2️⃣ Verificamos si hay llamada a la herramienta (function_call)
    const toolCall = message.tool_calls?.[0];
    if (toolCall && toolCall.function.name === 'get_vehicle_details') {
      // ⚠️ Ignoramos el post_id que proponga la IA y usamos el real
      const details = await this.getVehicleDetails(postId);

      // 3️⃣ Enviamos la respuesta final a la IA con los detalles
      const finalResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          ...fullMessages,
          {
            role: 'assistant',
            content: null,
            tool_calls: [toolCall],
          },
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(details),
          },
        ],
      });

      return finalResponse.choices[0].message.content;
    }

    // Si no hubo llamada a la herramienta, devuelve la respuesta directa
    return message.content;
  } catch (error) {
    console.error('Error en OpenAI:', error);
    throw new InternalServerErrorException('Error generando respuesta del chat');
  }
}


}
