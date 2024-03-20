import { LogFormat } from '@company/logger';
import { LogLevel } from '@nestjs/common';

/**
 * Topics of the configuration.
 */
export enum ConfigurationTopic {
  APPLICATION = 'application',
  LOGGER = 'logger',
}

/**
 * Structure of the main configuration about the application.
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
 * Structure of the logger configuration.
 */
export interface LoggerConfiguration {
  levels: LogLevel[];
  format: LogFormat;
  correlationIdField: string;
}

/**
 * Structure of the configuration
 */
export interface Configuration {
  application: ApplicationConfiguration;
  logger: LoggerConfiguration;
}
