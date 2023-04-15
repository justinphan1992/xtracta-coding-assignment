import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OcrServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async parseImage(file: Express.Multer.File) {
    const formData = new FormData();

    formData.append('apikey', this.configService.get('ocrSpace.apiKey'));
    formData.append('isOverlayRequired', 'true');
    formData.append('file', readFileSync(file.path), file.originalname);

    try {
      const response = await lastValueFrom(
        this.httpService.post('/parse/image', formData, {
          baseURL: this.configService.get('ocrSpace.baseUrl'),
          ...formData.getHeaders(),
        }),
      );

      return this._parseDataFromResponse(response.data);
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  _parseDataFromResponse(data) {
    if (data.IsErroredOnProcessing) {
      return { success: false, message: data.ErrorMessage[0] };
    }

    const words = data.ParsedResults[0]?.TextOverlay?.Lines?.reduce(
      (allWords, line) => {
        return [...allWords, ...line.Words];
      },
      [],
    );

    return { success: true, words: words || [] };
  }
}
