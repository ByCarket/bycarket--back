import { Module } from '@nestjs/common';
import { OpenAiController } from './openai.controller';
import { OpenAiService } from './openai.service';
import { UsersModule } from '../users/users.module';
import OpenAI from 'openai';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [UsersModule,ConfigModule],
    controllers: [OpenAiController],
    providers: [OpenAiService, {
        provide: OpenAI,
        useFactory: (configService: ConfigService) => {
            return new OpenAI({
                apiKey: configService.getOrThrow<string>('OPENAI_API_KEY'),
            });
        },
        inject: [ConfigService]
    }],
})
export class OpenAiModule { }
