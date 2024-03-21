import { LogFormat } from '@company/nestjs-common';
import { LogLevel } from '@nestjs/common';
import { Configuration } from './configuration.interface';

const DEFAULT_PORT = 3000;
const DEFAULT_RATE_LIMIT_TTL = 1000;
const DEFAULT_RATE_LIMIT_LIMIT = 100;

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
    logLevels: process.env.APP_LOG_LEVELS?.split(',').map((format) => format.trim() as LogLevel),
    logFormat: process.env.APP_LOG_FORMAT === 'JSON' ? LogFormat.JSON : LogFormat.CONSOLE,
  },
  rateLimit: [
    {
      ttl: process.env.APP_RATE_LIMIT_TTL ? Number.parseInt(process.env.APP_RATE_LIMIT_TTL, 10) : DEFAULT_RATE_LIMIT_TTL,
      limit: process.env.APP_RATE_LIMIT_LIMIT ? Number.parseInt(process.env.APP_RATE_LIMIT_LIMIT, 10) : DEFAULT_RATE_LIMIT_LIMIT,
    },
  ],
});
