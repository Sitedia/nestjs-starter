import { ConfigurableModuleBuilder, LogLevel } from '@nestjs/common';
import { LogFormat } from './models/log-format';

/**
 * Expected options for the logger module
 */
export interface LoggerModuleOptions {
  logLevels?: LogLevel[];
  logFormat?: LogFormat;
}

/**
 * Logger module builder
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<LoggerModuleOptions>().build();
