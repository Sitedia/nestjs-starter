import { HealthModule } from '@company/health';
import { LoggerModule } from '@company/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configuration } from './configurations/configuration';
import { ConfigurationTopic, LoggerConfiguration } from './configurations/configuration.interface';

/**
 * Content of the application.
 * In this design, a NestJS application is simply a group of NestJS modules.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 100 }]),
    HealthModule,
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
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
