import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ApplicationOptions } from './configuration.interface';

const TAGS = ['health'];

/**
 * Generates the OpenAPI specification for the application
 */
export const configureSwagger = (application: INestApplication, applicationOptions: ApplicationOptions, applicationUrl: string): OpenAPIObject | undefined => {
  // Check if Swagger UI should be enabled
  if (!applicationOptions.swaggerUIEnabled) {
    return undefined;
  }

  // Prepare the configuration
  const documentBuilder = new DocumentBuilder()
    .setTitle(applicationOptions.name)
    .setDescription(applicationOptions.description)
    .setVersion(applicationOptions.version)
    .addServer(applicationUrl);

  // Add tags
  for (const tag of TAGS) {
    documentBuilder.addTag(tag);
  }

  // Generate the OpenAPI specification
  const config = documentBuilder.build();
  const document = SwaggerModule.createDocument(application, config);

  // Set up Swagger
  SwaggerModule.setup(applicationOptions.basePath, application, document, {
    jsonDocumentUrl: '/api/openapi-docs',
  });

  return document;
};
