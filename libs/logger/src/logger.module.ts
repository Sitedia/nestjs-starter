/* Copyright (C) 2024 My company - All Rights Reserved */
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationExceptionFilter } from './filters/application-exception.filter';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './logger-module.definition';
import { ApplicationLogger } from './loggers/application.logger';

@Global()
@Module({
  providers: [
    ApplicationLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
  ],
  exports: [ApplicationLogger],
})
export class LoggerModule extends ConfigurableLoggerModule {}
