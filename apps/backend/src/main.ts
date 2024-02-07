import { ApplicationLogger, LogFormat } from '@company/logger';
import { INestApplication, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApplicationConfiguration } from './configuration/configuration.interface';

const LOG_FORMAT: LogFormat = process.env.APP_LOG_FORMAT === 'JSON' ? 'JSON' : 'CONSOLE';
const LOG_LEVELS: LogLevel[] = process.env.APP_LOG_LEVELS?.split(',').map((format) => format.trim() as LogLevel);

const configureSwagger = (application: INestApplication, applicationConfiguration: ApplicationConfiguration) => {
  // Check if Swagger UI should enabled
  if (!applicationConfiguration.swaggerUIEnabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle(applicationConfiguration.name)
    .setDescription(applicationConfiguration.description)
    .setVersion(applicationConfiguration.version)
    .build();

  const document = SwaggerModule.createDocument(application, config);
  SwaggerModule.setup(applicationConfiguration.basePath, application, document, { jsonDocumentUrl: '/api/openapi-docs' });

  return this;
};

export const bootstrap = async (listen: boolean) => {
  // Configure HTTPs
  const enableHTTPs = process.env['APP_TLS_ENABLED'] === 'true';
  const httpsOptions = {
    cert: process.env['APP_TLS_CERTIFICATE']?.replaceAll('\\n', '\n'),
    key: process.env['APP_TLS_KEY']?.replaceAll('\\n', '\n'),
  };

  // Init the application
  const application = await NestFactory.create(AppModule, {
    httpsOptions: enableHTTPs ? httpsOptions : undefined,
    logger: new ApplicationLogger({ logFormat: LOG_FORMAT, logLevels: LOG_LEVELS }),
  });

  // Load the configuration
  const configService = application.get(ConfigService);
  const applicationConfiguration = configService.get<ApplicationConfiguration>('application');

  // Configure the entry point
  application.setGlobalPrefix(applicationConfiguration.basePath);
  application.use(helmet());
  application.enableCors({ origin: applicationConfiguration.origin });
  application.enableVersioning();

  // Configure Swagger
  configureSwagger(application, applicationConfiguration);

  // Start the application
  await (listen ? application.listen(applicationConfiguration.port) : application.init());

  // Log the entrypoint
  const logger = application.get(ApplicationLogger);
  const listeningUrl = `${enableHTTPs ? 'https' : 'http'}://localhost:${applicationConfiguration.port}/${applicationConfiguration.basePath}/`;
  logger.log(`>>> Application is listening on ${listeningUrl}`, 'Main');

  return application;
};

// eslint-disable-next-line jest/require-hook
bootstrap(true);
