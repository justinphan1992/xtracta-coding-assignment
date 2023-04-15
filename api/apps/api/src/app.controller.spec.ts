import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORC_SERVICE_TOKEN } from './constants';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: ORC_SERVICE_TOKEN,
            transport: Transport.TCP,
          },
        ]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('parse image action', () => {
    const file = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
    } as Express.Multer.File;

    it('should return the expected result', async () => {
      const expectedResult = {
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

      jest
        .spyOn(appService, 'parseImage')
        .mockImplementation(() => Promise.resolve(expectedResult));

      const result = await appController.parseImage(file);
      expect(result).toEqual(expectedResult);
      expect(appService.parseImage).toHaveBeenCalledWith(file);
    });
  });
});
