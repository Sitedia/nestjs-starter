import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './logger-module.definition';
import { ApplicationLogger } from './services/application.logger';

/**
 * Dynamic module for the logger
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
@Global()
@Module({
  providers: [ApplicationLogger],
  exports: [ApplicationLogger],
})
export class LoggerModule extends ConfigurableLoggerModule {}
