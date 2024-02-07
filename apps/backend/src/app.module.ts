import { HealthModule } from '@company/health';
import { LoggerModule } from '@company/logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { configuration } from './configuration/configuration';
import { ApplicationConfiguration } from './configuration/configuration.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 100 }]),
    HealthModule,
    LoggerModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const applicationConfiguration: ApplicationConfiguration =
          configService.get('application')!;
        return {
          logLevels: applicationConfiguration.logLevels,
          logFormat: applicationConfiguration.logFormat,
          correlationIdField: applicationConfiguration.logCorrelationIdField,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
