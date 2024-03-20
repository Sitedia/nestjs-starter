import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationExceptionFilter } from './filters/application-exception.filter';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './logger-module.definition';
import { ApplicationLogger } from './loggers/application.logger';

/**
 * Dynamic module for the logger
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
@Global()
@Module({
  providers: [
    ApplicationLogger,
    {
      provide: APP_INTERCEPTOR, // See: https://docs.nestjs.com/interceptors#binding-interceptors
      useClass: RequestInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter, // See https://docs.nestjs.com/exception-filters#binding-filters
    },
  ],
  exports: [ApplicationLogger],
})
export class LoggerModule extends ConfigurableLoggerModule {}
