import { ApplicationLogger, LogFormat } from '@company/logger';
import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as fs from 'node:fs';
import { AppModule } from './app.module';
import { ApplicationConfiguration } from './configuration/configuration.interface';

const configureSwagger = (
  application: INestApplication,
  applicationConfiguration: ApplicationConfiguration,
  applicationUrl: string,
) => {
  // Check if Swagger UI should enabled
  if (!applicationConfiguration.swaggerUIEnabled) {
    return;
  }

  // Get the API url

  const config = new DocumentBuilder()
    .setTitle(applicationConfiguration.name)
    .setDescription(applicationConfiguration.description)
    .setVersion(applicationConfiguration.version)
    .addTag('health')
    .addServer(applicationUrl)
    .build();

  const document = SwaggerModule.createDocument(application, config);
  SwaggerModule.setup(
    applicationConfiguration.basePath,
    application,
    document,
    {
      jsonDocumentUrl: '/api/openapi-docs',
    },
  );

  return document;
};

const secureEntrypoint = (
  application: INestApplication,
  applicationConfiguration: ApplicationConfiguration,
) => {
  application.setGlobalPrefix(applicationConfiguration.basePath);
  application.use(helmet());
  application.enableCors({ origin: applicationConfiguration.origin });
  application.enableVersioning();

  return this;
};

export const bootstrap = async (mode: 'LISTEN' | 'TEST' | 'SWAGGER') => {
  const LOG_FORMAT: LogFormat =
    process.env.APP_LOG_FORMAT === 'JSON' ? 'JSON' : 'CONSOLE';
  const LOG_LEVELS: LogLevel[] = process.env.APP_LOG_LEVELS?.split(',').map(
    (format) => format.trim() as LogLevel,
  );

  // Configure HTTPs
  const enableHTTPs = process.env['APP_TLS_ENABLED'] === 'true';
  const httpsOptions = {
    cert: process.env['APP_TLS_CERTIFICATE']?.replaceAll('\\n', '\n'),
    key: process.env['APP_TLS_KEY']?.replaceAll('\\n', '\n'),
  };

  // Init the application
  const application = await NestFactory.create(AppModule, {
    httpsOptions: enableHTTPs ? httpsOptions : undefined,
    logger: new ApplicationLogger({
      logFormat: LOG_FORMAT,
      logLevels: LOG_LEVELS,
    }),
  });

  // Load the configuration
  const configService = application.get(ConfigService);
  const applicationConfiguration =
    configService.get<ApplicationConfiguration>('application');

  // Configure the entry point
  secureEntrypoint(application, applicationConfiguration);

  // Configure Swagger
  const applicationUrl = `${enableHTTPs ? 'https' : 'http'}://localhost:${applicationConfiguration.port}`;
  const document = configureSwagger(
    application,
    applicationConfiguration,
    applicationUrl,
  );

  // Start the application
  switch (mode) {
    case 'TEST': {
      await application.init();
      break;
    }
    case 'SWAGGER': {
      await application.init();
      fs.writeFileSync('openapi.json', JSON.stringify(document));
      break;
    }
    default: {
      application.listen(applicationConfiguration.port);
      const logger = application.get(ApplicationLogger);
      logger.log(
        `>>> Application is listening on ${applicationUrl}/${applicationConfiguration.basePath}`,
        'Main',
      );
    }
  }

  return application;
};

// eslint-disable-next-line jest/require-hook
bootstrap(process.env.APP_MODE as 'LISTEN' | 'TEST' | 'SWAGGER');
