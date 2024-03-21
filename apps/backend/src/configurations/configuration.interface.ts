import { LoggerModuleOptions } from '@company/nestjs-common';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Main parts of the configuration
 */
export enum ConfigurationOptions {
  APPLICATION = 'application',
  LOGGER = 'logger',
  RATE_LIMIT = 'rateLimit',
}

/**
 * Structure of the application configuration
 */
export interface ApplicationOptions {
  name: string;
  description?: string;
  version: string;
  port: number;
  origin: string;
  basePath: string;
  swaggerUIEnabled: boolean;
}

/**
 * Final structure of the whole configuration
 */
export interface Configuration {
  [ConfigurationOptions.APPLICATION]: ApplicationOptions;
  [ConfigurationOptions.LOGGER]: LoggerModuleOptions;
  [ConfigurationOptions.RATE_LIMIT]: ThrottlerModuleOptions;
}
