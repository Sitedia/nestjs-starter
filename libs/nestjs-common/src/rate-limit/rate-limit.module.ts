import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigurableModuleClass as ConfigurableLoggerModule } from './rate-limit-module.definition';

/**
 * Dynamic module for the logger
 * See: https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder
 */
@Global()
@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 1000, limit: 1 }])],
  providers: [
    {
      provide: APP_GUARD, // apply the rate limit on each endpoint
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule extends ConfigurableLoggerModule {}
