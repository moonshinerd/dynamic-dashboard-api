import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Dynamic Dashboard API')
    .setDescription(
      'API REST para indicadores de performance (KPIs) de manutenção, ' +
      'agrupados por família de equipamentos. Suporta múltiplos formatos ' +
      'de resposta para integração com dashboards (tabela, pizza, barras, linhas).',
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT, '0.0.0.0');
  console.log(`Application running on port ${env.PORT}`);
  console.log(`Swagger docs available at http://localhost:${env.PORT}/api/docs`);
}

bootstrap();
