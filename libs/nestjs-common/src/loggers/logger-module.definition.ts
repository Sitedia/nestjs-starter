import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LoggerModuleOptions } from './logger-module.options';

/**
 * Builder for the dynamic Logger module
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<LoggerModuleOptions>().build();
