/* Copyright (C) 2024 My company - All Rights Reserved */
import { LogFormat } from '@company/logger';
import { LogLevel } from '@nestjs/common';

export interface ApplicationConfiguration {
  name: string;
  description?: string;
  version: string;
  port: number;
  origin: string;
  basePath: string;
  swaggerUIEnabled: boolean;
  logLevels: LogLevel[];
  logFormat: LogFormat;
  logCorrelationIdField: string;
}

export interface Configuration {
  application: ApplicationConfiguration;
}
