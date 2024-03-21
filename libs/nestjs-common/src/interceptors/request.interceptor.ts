import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { catchError, throwError } from 'rxjs';
import { ApplicationLogger } from '../loggers/services/application.logger';

/**
 * Interceptor to track calls to NestJS and errors.
 * Note: only calls to the API are tracked here, calls on static files and invalid paths may not appear.
 */
@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: ApplicationLogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request: IncomingMessage = context.switchToHttp().getRequest();

    // Log before
    const clientRequest = `${request.method} ${request.url}`;
    this.logger.debug(clientRequest, RequestInterceptor.name);

    // Handle and log response status
    return next.handle().pipe(
      catchError((error) => {
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = `${clientRequest} | ${status} | ${error.message}`;

        // Log the error
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
          this.logger.error(message, RequestInterceptor.name);
        } else {
          this.logger.warn(message, RequestInterceptor.name);
        }

        return throwError(() => error);
      }),
    );
  }
}
