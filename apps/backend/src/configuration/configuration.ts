import { LogFormat } from '@company/logger';
import { LogLevel } from '@nestjs/common';
import { Configuration } from './configuration.interface';

const DEFAULT_PORT = 3000;

/**
 * Configuration in Typescript format to be easily used in the source code.
 * The settings are loaded from environment variables.
 */
export const configuration = (): Configuration => ({
  application: {
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    origin: process.env.APP_CORS_ORIGIN,
    basePath: process.env.APP_BASE_PATH,
    swaggerUIEnabled: process.env.APP_SWAGGER_UI_ENABLED === 'true',
  },
  logger: {
    levels: process.env.APP_LOG_LEVELS?.split(',').map((format) => format.trim() as LogLevel),
    format: process.env.APP_LOG_FORMAT === 'JSON' ? LogFormat.JSON : LogFormat.CONSOLE,
    correlationIdField: 'correlationId',
  },
});
