import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 1000, limit: 1 }])],
  providers: [
    {
      provide: APP_GUARD, // apply the rate limit on each endpoint
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
