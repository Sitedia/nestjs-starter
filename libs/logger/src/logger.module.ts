import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './logger-module.definition';
import { ApplicationExceptionFilter } from './loggers/application-exception-filter';
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
