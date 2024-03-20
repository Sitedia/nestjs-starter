import { LogFormat } from '@company/nestjs-common';
import { LogLevel } from '@nestjs/common';

/**
 * Topics of the configuration
 */
export enum ConfigurationTopic {
  APPLICATION = 'application',
  LOGGER = 'logger',
  RATE_LIMIT = 'rateLimit',
}

/**
 * Structure of the application configuration
 */
export interface ApplicationConfiguration {
  name: string;
  description?: string;
  version: string;
  port: number;
  origin: string;
  basePath: string;
  swaggerUIEnabled: boolean;
}

/**
 * Structure of the logger configuration
 */
export interface LoggerConfiguration {
  levels: LogLevel[];
  format: LogFormat;
  correlationIdField: string;
}

/**
 * Structure of the rate limite configuration
 */
export interface RateLimitConfiguration {
  ttl: number;
  limit: number;
}

/**
 * Final structure of the whole configuration
 */
export interface Configuration {
  application: ApplicationConfiguration;
  logger: LoggerConfiguration;
  rateLimit: RateLimitConfiguration;
}
