import { Module } from '@nestjs/common';
import { OcrServiceController } from './ocr-service.controller';
import { OcrServiceService } from './ocr-service.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configs] }),
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get('ocrSpace.timeout'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OcrServiceController],
  providers: [OcrServiceService],
})
export class OcrServiceModule {}
