import { AxiosResponse } from 'axios';

export const successResponse = {
  ParsedResults: [
    {
      TextOverlay: {
        Lines: [
          {
            LineText: 'Invoice INVOOIO',
            Words: [
              {
                WordText: 'Invoice',
                Left: 273,
                Top: 253,
                Height: 32,
                Width: 140,
              },
            ],
            MaxHeight: 32,
            MinTop: 253,
          },
        ],
        HasOverlay: true,
        Message: 'Total lines: 46',
      },
      TextOrientation: '0',
      FileParseExitCode: 1,
      ParsedText: '',
      ErrorMessage: '',
      ErrorDetails: '',
    },
  ],
  OCRExitCode: 1,
  IsErroredOnProcessing: false,
  ProcessingTimeInMilliseconds: '1578',
  SearchablePDFURL: 'Searchable PDF not generated as it was not requested.',
};

export const failedResponse = {
  OCRExitCode: 3,
  IsErroredOnProcessing: true,
  ErrorMessage: [
    'File failed validation. File size exceeds the maximum permissible file size limit of 1024 KB',
  ],
  ErrorDetails: '',
  ProcessingTimeInMilliseconds: '15',
};

export const file = {
  fieldname: 'file',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test'),
  size: 1024,
  path: '/Users/username/Downloads/test.jpg',
} as Express.Multer.File;

export const getAxiosResponse = (data: any) => {
  return {
    data,
    headers: {} as AxiosResponse['headers'],
    config: {} as AxiosResponse['config'],
    status: 200,
    statusText: 'OK',
  } as AxiosResponse<any, any>;
};
