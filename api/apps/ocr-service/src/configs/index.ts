import { Config } from './config.interface';

export default (): Config => ({
  app: {
    host: process.env.OCR_SERVICE_HOST || 'localhost',
    port: +process.env.OCR_SERVICE_PORT || 3001,
  },
  ocrSpace: {
    baseUrl: process.env.ORC_SPACE_BASE_URL || '',
    apiKey: process.env.ORC_SPACE_API_KEY || '',
    timeout: 30000,
  },
});
