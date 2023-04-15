import { Test, TestingModule } from '@nestjs/testing';
import { OcrServiceController } from './ocr-service.controller';
import { OcrServiceService } from './ocr-service.service';
import { file } from '../test/fixtures/mock-data';

describe('OcrServiceController', () => {
  let ocrServiceController: OcrServiceController;
  let ocrServiceService: OcrServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrServiceController],
      providers: [OcrServiceService],
    })
      .overrideProvider(OcrServiceService)
      .useValue({ parseImage: jest.fn() })
      .compile();

    ocrServiceController =
      module.get<OcrServiceController>(OcrServiceController);
    ocrServiceService = module.get<OcrServiceService>(OcrServiceService);
  });

  describe('parse image action', () => {
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
        .spyOn(ocrServiceService, 'parseImage')
        .mockImplementation(() => Promise.resolve(expectedResult));

      const result = await ocrServiceController.parseImage(file);
      expect(result).toEqual(expectedResult);
    });
  });
});
