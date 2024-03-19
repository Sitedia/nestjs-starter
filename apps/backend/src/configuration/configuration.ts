import { LogLevel } from '@nestjs/common';
import { Configuration } from './configuration.interface';

const DEFAULT_PORT = 3000;

export const configuration = (): Configuration => ({
  application: {
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    origin: process.env.APP_CORS_ORIGIN,
    basePath: process.env.APP_BASE_PATH,
    swaggerUIEnabled: process.env.APP_SWAGGER_UI_ENABLED === 'true',
    logFormat: process.env.APP_LOG_FORMAT === 'JSON' ? 'JSON' : 'CONSOLE',
    logLevels: process.env.APP_LOG_LEVELS?.split(',').map((format) => format.trim() as LogLevel),
    logCorrelationIdField: 'correlationId',
  },
});
