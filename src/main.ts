import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bycarket API')
    .setDescription('API documentation for Bycarket')
    .setVersion('1.0')
    .addTag('bycarket')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        const order = ['Vehicles'];
        return order.indexOf(a) - order.indexOf(b);
      },
      operationsSorter: 'method',
    },
  });
  app.use(LoggerGlobal);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
