import { ApplicationExceptionFilter, HealthModule, LoggerModule, RateLimitModule, RequestInterceptor } from '@company/nestjs-common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { configuration } from './configurations/configuration';
import { ConfigurationTopic, LoggerConfiguration } from './configurations/configuration.interface';

/**
 * Content of the application.
 * In this design, a NestJS application is simply a group of NestJS modules.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    HealthModule,
    RateLimitModule,
    LoggerModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const loggerConfiguration = configService.get<LoggerConfiguration>(ConfigurationTopic.LOGGER);
        return {
          logLevels: loggerConfiguration.levels,
          logFormat: loggerConfiguration.format,
          correlationIdField: loggerConfiguration.correlationIdField,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
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
