export interface Config {
  app: AppConfig;
  ocrSpace: OcrSpaceConfig;
}

export interface AppConfig {
  host: string;
  port: number;
}

export interface OcrSpaceConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}
