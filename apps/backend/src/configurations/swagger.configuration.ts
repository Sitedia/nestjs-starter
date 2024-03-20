import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ApplicationConfiguration } from './configuration.interface';

export const configureSwagger = (application: INestApplication, applicationConfiguration: ApplicationConfiguration, applicationUrl: string): OpenAPIObject | undefined => {
  // Check if Swagger UI should enabled
  if (!applicationConfiguration.swaggerUIEnabled) {
    return undefined;
  }

  const config = new DocumentBuilder()
    .setTitle(applicationConfiguration.name)
    .setDescription(applicationConfiguration.description)
    .setVersion(applicationConfiguration.version)
    .addTag('health')
    .addServer(applicationUrl)
    .build();

  const document = SwaggerModule.createDocument(application, config);
  SwaggerModule.setup(applicationConfiguration.basePath, application, document, {
    jsonDocumentUrl: '/api/openapi-docs',
  });

  return document;
};
