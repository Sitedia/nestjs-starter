import { ApplicationExceptionFilter, HealthModule, LoggerModule, RequestInterceptor } from '@company/nestjs-common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configuration } from './configurations/configuration';
import { ConfigurationOptions } from './configurations/configuration.interface';

/**
 * Content of the application.
 * In this design, a NestJS application is simply an aggregate of NestJS modules.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get(ConfigurationOptions.RATE_LIMIT),
      inject: [ConfigService],
    }),
    LoggerModule.registerAsync({
      useFactory: (configService: ConfigService) => configService.get(ConfigurationOptions.LOGGER),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD, // see: https://docs.nestjs.com/security/rate-limiting#rate-limiting
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR, // see: https://docs.nestjs.com/interceptors#binding-interceptors
      useClass: RequestInterceptor,
    },
    {
      provide: APP_FILTER, // see https://docs.nestjs.com/exception-filters#binding-filters
      useClass: ApplicationExceptionFilter,
    },
  ],
})
export class AppModule {}
