import { ConfigurableModuleBuilder } from '@nestjs/common';

/**
 * Expected configuration for the logger module
 */
export interface RateLimitModuleOptions {
  ttl: number;
  limit: number;
}

/**
 * Logger module builder
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<RateLimitModuleOptions>().setExtras({ global: true }).build() as {
  ConfigurableModuleClass;
  MODULE_OPTIONS_TOKEN;
};
