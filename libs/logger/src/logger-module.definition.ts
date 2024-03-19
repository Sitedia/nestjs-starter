import { ConfigurableModuleBuilder, LogLevel } from '@nestjs/common';
import { LogFormat } from './models/log-format';

export interface LoggerModuleOptions {
  logLevels?: LogLevel[];
  logFormat?: LogFormat;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<LoggerModuleOptions>()
  .setExtras({ global: true })
  .build() as {
  ConfigurableModuleClass;
  MODULE_OPTIONS_TOKEN;
};
