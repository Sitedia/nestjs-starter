import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ApplicationConfiguration } from './configuration.interface';

export const secureEntrypoint = (application: INestApplication, applicationConfiguration: ApplicationConfiguration) => {
  application.setGlobalPrefix(applicationConfiguration.basePath);
  application.use(helmet());
  application.enableCors({ origin: applicationConfiguration.origin });
  application.enableVersioning();

  return this;
};
