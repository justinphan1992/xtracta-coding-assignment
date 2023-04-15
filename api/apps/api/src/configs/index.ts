import { Config } from './config.interface';

export default (): Config => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.API_GATEWAY_HOST || 'localhost',
    port: +process.env.API_GATEWAY_PORT || 3000,
  },
  ocrService: {
    host: process.env.ORC_SERVICE_HOST || 'localhost',
    port: +process.env.ORC_SERVICE_PORT || 3001,
  },
});
