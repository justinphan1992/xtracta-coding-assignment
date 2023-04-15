import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { OcrServiceModule } from '../src/ocr-service.module';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  failedResponse,
  file,
  getAxiosResponse,
  successResponse,
} from './fixtures/mock-data';
import { join } from 'path';

const microserviceOptions: ClientOptions = {
  transport: Transport.TCP,
};

describe('OcrServiceController (e2e)', () => {
  let app: INestMicroservice;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OcrServiceModule],
    })
      .overrideProvider(HttpService)
      .useValue({ post: jest.fn() })
      .compile();

    app = moduleFixture.createNestMicroservice(microserviceOptions);

    await app.listen();

    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return parsed text from image', async () => {
    const sendfile = {
      ...file,
      path: join(__dirname, 'fixtures', 'small-image.jpg'),
    };
    const client = ClientProxyFactory.create(microserviceOptions);
    const response = getAxiosResponse(successResponse);
    jest.spyOn(httpService, 'post').mockImplementation(() => of(response));

    const result = await lastValueFrom(
      client.send({ cmd: 'parse-image' }, sendfile),
    );

    expect(result).toEqual({
      success: true,
      words: [
        {
          WordText: 'Invoice',
          Left: 273,
          Top: 253,
          Height: 32,
          Width: 140,
        },
      ],
    });

    client.close();
  });

  it('should return error message if image is not valid', async () => {
    const sendfile = {
      ...file,
      path: join(__dirname, 'fixtures', 'small-image.jpg'),
    };
    const client = ClientProxyFactory.create(microserviceOptions);
    const response = getAxiosResponse(failedResponse);
    jest.spyOn(httpService, 'post').mockImplementation(() => of(response));

    const result = await lastValueFrom(
      client.send({ cmd: 'parse-image' }, sendfile),
    );

    expect(result).toEqual({
      success: false,
      message:
        'File failed validation. File size exceeds the maximum permissible file size limit of 1024 KB',
    });

    client.close();
  });
});
