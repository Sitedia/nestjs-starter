import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './logger-module.definition';
import { ApplicationLogger } from './services/application.logger';

/**
 * Logger module
 */
@Global()
@Module({
  providers: [ApplicationLogger],
  exports: [ApplicationLogger],
})
export class LoggerModule extends ConfigurableLoggerModule {}
