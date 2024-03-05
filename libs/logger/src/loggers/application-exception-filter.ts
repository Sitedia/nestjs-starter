import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationLogger } from './application.logger';

@Catch(HttpException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ApplicationLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    // Log server NestJS errors
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception.message,
        exception.stack,
        ApplicationExceptionFilter.name,
      );
    } else {
      this.logger.warn(
        `${exception.constructor.name}: ${exception.message}`,
        ApplicationExceptionFilter.name,
      );
    }

    response.status(status).json({
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
