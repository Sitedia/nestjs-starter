/* eslint-disable jest/require-hook */
import { ApplicationLogger, LogFormat } from '@company/logger';
import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs';
import { AppModule } from './app.module';
import { ApplicationConfiguration, ConfigurationTopic } from './configurations/configuration.interface';
import { secureEntrypoint } from './configurations/entrypoint.configuration';
import { configureSwagger } from './configurations/swagger.configuration';
import { ApplicationMode } from './models/application-mode';

export const bootstrap = async (mode: ApplicationMode): Promise<INestApplication> => {
  // Create the logger before the application starts, to allow JSON logs during start
  const LOG_FORMAT: LogFormat = process.env.APP_LOG_FORMAT === 'JSON' ? LogFormat.JSON : LogFormat.CONSOLE;
  const LOG_LEVELS: LogLevel[] = process.env.APP_LOG_LEVELS?.split(',').map((format) => format.trim() as LogLevel);
  const logger = new ApplicationLogger({ logFormat: LOG_FORMAT, logLevels: LOG_LEVELS });

  // Configure HTTPs
  const enableHTTPs = process.env['APP_TLS_ENABLED'] === 'true';
  const httpsOptions = {
    cert: process.env['APP_TLS_CERTIFICATE']?.replaceAll('\\n', '\n'),
    key: process.env['APP_TLS_KEY']?.replaceAll('\\n', '\n'),
  };

  // Init the application
  const application = await NestFactory.create(AppModule, {
    httpsOptions: enableHTTPs ? httpsOptions : undefined,
    logger,
  });

  // Load the configuration
  const configService = application.get(ConfigService);
  const applicationConfiguration = configService.get<ApplicationConfiguration>(ConfigurationTopic.APPLICATION);

  // Configure the entry point
  secureEntrypoint(application, applicationConfiguration);

  // Configure Swagger
  const applicationUrl = `${enableHTTPs ? 'https' : 'http'}://localhost:${applicationConfiguration.port}`;
  const document = configureSwagger(application, applicationConfiguration, applicationUrl);

  // Start the application in the requested mode
  switch (mode) {
    case ApplicationMode.TEST: {
      await application.init();
      break;
    }
    case ApplicationMode.SWAGGER: {
      await application.init();
      const INDENT = 2;
      fs.writeFileSync('openapi.json', JSON.stringify(document, undefined, INDENT));
      break;
    }
    default: {
      application.listen(applicationConfiguration.port);
      const logger = application.get(ApplicationLogger);
      logger.log(`>>> Application is listening on ${applicationUrl}/${applicationConfiguration.basePath}`, 'Main');
    }
  }

  return application;
};

bootstrap(process.env.APP_MODE as ApplicationMode);
