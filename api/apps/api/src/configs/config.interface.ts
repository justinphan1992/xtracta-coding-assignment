export interface Config {
  app: AppConfig;
  ocrService: OcrServiceConfig;
}

export interface AppConfig {
  nodeEnv: string;
  host: string;
  port: number;
}

export interface OcrServiceConfig {
  host: string;
  port: number;
}
