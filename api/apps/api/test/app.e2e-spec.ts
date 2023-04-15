import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { of } from 'rxjs';
import { ORC_SERVICE_TOKEN } from '../src/constants';
import { createReadStream } from 'fs';
import { join } from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const response = {
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
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ORC_SERVICE_TOKEN)
      .useValue({
        send: jest.fn().mockImplementation(() => of(response)),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ocr/image (POST)', () => {
    it('should throw error if file is not provided', () => {
      return request(app.getHttpServer())
        .post('/ocr/image')
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'File is required',
        });
    });

    it('should throw error if file is not an image', () => {
      return request(app.getHttpServer())
        .post('/ocr/image')
        .attach(
          'file',
          createReadStream(join(__dirname, 'fixtures', 'test.txt')),
        )
        .expect(400)
        .expect({
          statusCode: 400,
          message:
            'Validation failed (expected type is /\\.*(jpe?g|png|bmp|webp)$/i)',
        });
    });

    it('should throw error if file is larger than 1MB', () => {
      return request(app.getHttpServer())
        .post('/ocr/image')
        .attach(
          'file',
          createReadStream(join(__dirname, 'fixtures', 'large-image.jpg')),
        )
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Validation failed (expected size is less than 1048576)',
        });
    });

    it('should return the expected result', () => {
      return request(app.getHttpServer())
        .post('/ocr/image')
        .attach(
          'file',
          createReadStream(join(__dirname, 'fixtures', 'small-image.jpg')),
        )
        .expect(200)
        .expect(response);
    });
  });
});
