import { Module } from '@nestjs/common';
import { OpenAiController } from './openai.controller';
import { OpenAiService } from './openai.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 Importamos TypeOrmModule
import { Post } from 'src/entities/post.entity'; // 👈 Importamos la entidad Post
import OpenAI from 'openai';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([Post]), // 👈 ¡Importamos el repo que necesita OpenAiService!
  ],
  controllers: [OpenAiController],
  providers: [
    OpenAiService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.getOrThrow<string>('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OpenAiModule {}
