import { NestFactory } from '@nestjs/core';
import { OcrServiceModule } from './ocr-service.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('OrcService');
  const app = await NestFactory.create(OcrServiceModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('app.host'),
      port: configService.get('app.port'),
    },
    logger,
  });

  await app.startAllMicroservices();
}
bootstrap();
