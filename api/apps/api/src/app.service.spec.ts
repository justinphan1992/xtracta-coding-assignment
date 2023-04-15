import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { ORC_SERVICE_TOKEN } from './constants';

describe('AppService', () => {
  let appService: AppService;
  let clientProxy: ClientProxy;

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
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
    clientProxy = module.get<ClientProxy>(ORC_SERVICE_TOKEN);
  });

  describe('parseImage', () => {
    const file = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
    } as Express.Multer.File;

    it('should send message to OrcService', async () => {
      const pattern = { cmd: 'parse-image' };
      jest.spyOn(clientProxy, 'send').mockImplementationOnce(() => of({}));
      await appService.parseImage(file);
      expect(clientProxy.send).toHaveBeenCalledWith(pattern, file);
    });

    it('should throw an error when OrcService return error', async () => {
      const error = {
        response: {
          statusCode: 500,
          message: 'Test Error',
          error: 'Internal Server Error',
        },
        status: 500,
        options: {},
        message: 'test 123',
        name: 'InternalServerErrorException',
      };

      jest
        .spyOn(clientProxy, 'send')
        .mockImplementationOnce(() => throwError(() => error));

      await expect(appService.parseImage(file)).rejects.toThrow('Test Error');
    });
  });
});
