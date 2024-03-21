import { LoggerModuleOptions } from '@company/nestjs-common';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

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
  [ConfigurationTopic.APPLICATION]: ApplicationOptions;
  [ConfigurationTopic.LOGGER]: LoggerModuleOptions;
  [ConfigurationTopic.RATE_LIMIT]: ThrottlerModuleOptions;
}
