import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ApplicationOptions } from './configuration.interface';

/**
 * Secures the entrypoint of the application
 */
export const secureEntrypoint = (application: INestApplication, applicationOptions: ApplicationOptions) => {
  application.setGlobalPrefix(applicationOptions.basePath);
  application.use(helmet());
  application.enableCors({ origin: applicationOptions.origin });
  application.enableVersioning();

  return this;
};
