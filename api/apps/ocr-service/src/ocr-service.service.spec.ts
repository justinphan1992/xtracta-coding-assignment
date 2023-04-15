import { HttpModule, HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { OcrServiceService } from './ocr-service.service';
import { of, throwError } from 'rxjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import {
  failedResponse,
  file,
  successResponse,
  getAxiosResponse,
} from '../test/fixtures/mock-data';

describe('OcrServiceService', () => {
  let orcServiceService: OcrServiceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [OcrServiceService],
    })
      .overrideProvider(HttpService)
      .useValue({ post: jest.fn() })
      .overrideProvider(ConfigService)
      .useValue({ get: () => 'string' })
      .compile();

    orcServiceService = module.get<OcrServiceService>(OcrServiceService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('parseImage', () => {
    it('should return the expected result with success response', async () => {
      const response = getAxiosResponse(successResponse);

      jest.spyOn(httpService, 'post').mockImplementation(() => of(response));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('test');
      const result = await orcServiceService.parseImage(file);
      const expectedResult =
        orcServiceService._parseDataFromResponse(successResponse);
      expect(result).toEqual(expectedResult);
    });

    it('should return the expected result with failed response', async () => {
      const response = getAxiosResponse(failedResponse);

      jest.spyOn(httpService, 'post').mockImplementation(() => of(response));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('test');
      const result = await orcServiceService.parseImage(file);
      const expectedResult =
        orcServiceService._parseDataFromResponse(failedResponse);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error when the request is not successful', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() =>
          throwError(() => new Error('Something went wrong')),
        );
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('test');
      await expect(orcServiceService.parseImage(file)).rejects.toThrow(
        'Something went wrong',
      );
    });
  });
});
