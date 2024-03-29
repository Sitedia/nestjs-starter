/* eslint-disable unicorn/prefer-module */
/* eslint-disable jest/require-hook */
import { ApplicationLogger, constants } from '@company/nestjs-common';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs';
import { AppModule } from './app.module';
import { ApplicationOptions, ConfigurationOptions } from './configurations/configuration.interface';
import { secureEntrypoint } from './configurations/entrypoint.configuration';
import { configureSwagger } from './configurations/swagger.configuration';
import { ApplicationMode } from './models/application-model.enum';

/**
 * Bootstrap of the NestJS application
 */
export const bootstrap = async (mode: ApplicationMode): Promise<INestApplication> => {
  // Configure HTTPs
  const enableHTTPs = process.env['APP_TLS_ENABLED'] === 'true';
  const httpsOptions = {
    cert: process.env['APP_TLS_CERTIFICATE']?.replaceAll('\\n', '\n'),
    key: process.env['APP_TLS_KEY']?.replaceAll('\\n', '\n'),
  };

  // Create the NestJS application
  const application = await NestFactory.create(AppModule, {
    bufferLogs: true, // buffer the first logs until out custom logger is set (see below)
    httpsOptions: enableHTTPs ? httpsOptions : undefined,
  });

  // Set our custom logger (https://docs.nestjs.com/techniques/logger)
  const applicationlogger = application.get(ApplicationLogger);
  application.useLogger(applicationlogger);

  // Load the configuration
  const configService = application.get(ConfigService);
  const applicationOptions = configService.get<ApplicationOptions>(ConfigurationOptions.APPLICATION);

  // Secure the entry point
  secureEntrypoint(application, applicationOptions);

  // Configure Swagger
  const applicationUrl = `${enableHTTPs ? 'https' : 'http'}://localhost:${applicationOptions.port}`;
  const document = configureSwagger(application, applicationOptions, applicationUrl);

  // Start the application in the requested mode
  switch (mode) {
    case ApplicationMode.TEST: {
      await application.init();
      break;
    }
    case ApplicationMode.SWAGGER: {
      await application.init();
      fs.writeFileSync(__dirname + '/openapi.json', JSON.stringify(document, undefined, constants.JSON_INDENTATION));
      break;
    }
    default: {
      await application.listen(applicationOptions.port);
      applicationlogger.log(`>>> Application is listening on ${applicationUrl}/${applicationOptions.basePath}`, 'Main');
      break;
    }
  }

  return application;
};

// Launch the application
bootstrap(process.env.APP_MODE as ApplicationMode);
