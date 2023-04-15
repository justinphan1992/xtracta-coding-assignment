import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OcrServiceService } from './ocr-service.service';

@Controller()
export class OcrServiceController {
  constructor(private readonly ocrServiceService: OcrServiceService) {}

  @MessagePattern({ cmd: 'parse-image' })
  async parseImage(file: Express.Multer.File) {
    return this.ocrServiceService.parseImage(file);
  }
}
