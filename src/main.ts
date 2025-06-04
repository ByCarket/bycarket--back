import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
      operationsSorter: (a: any, b: any) => {
        const order = ['get', 'post', 'put', 'patch', 'delete'];
        return order.indexOf(a.get('method')) - order.indexOf(b.get('method'));
      },
    },
  });
  app.use(LoggerGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => {
        const cleanErrors = errors.map(error => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert: 'The following errors were made in the request:',
          errors: cleanErrors,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
