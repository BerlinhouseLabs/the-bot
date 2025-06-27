import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import fastifyMultipart from '@fastify/multipart';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 100 * 1024 * 1024,
      maxParamLength: 5000,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1/core');
  app.enableCors();

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100 * 1024 * 1024,
      fields: 10,
      fileSize: 100 * 1024 * 1024,
      files: 10,
      headerPairs: 2000,
    },
  });

  await app.listen(configService.get<string>('PORT') || 3000);
}
bootstrap();
