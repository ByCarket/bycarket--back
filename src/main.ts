import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const swaggerConfig = new DocumentBuilder().setTitle
  ('Bycarket API')
  .setDescription('API documentation for Bycarket')
  .setVersion('1.0')
  .addTag('bycarket')
  .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document,{
    swaggerOptions:{
      tagsSorter:(a: string, b: string) => {
        const order = ['Vehicles'];
        return order.indexOf(a) - order.indexOf(b);
      },
      operationsSorter: 'method',
    }}
  );
  await app.listen(process.env.PORT ?? 3000);
  }


  
bootstrap();
