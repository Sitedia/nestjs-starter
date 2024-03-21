import { LogLevel } from '@nestjs/common';
import { LogFormat } from './models/log-format';

/**
 * Expected options for the logger module
 */
export interface LoggerModuleOptions {
  logLevels?: LogLevel[];
  logFormat?: LogFormat;
}
