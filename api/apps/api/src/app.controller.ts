import {
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MAX_FILE_SIZE, IMAGE_EXTENSIONS } from './utils/file';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ocr')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async parseImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: IMAGE_EXTENSIONS }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.parseImage(file);
  }
}
