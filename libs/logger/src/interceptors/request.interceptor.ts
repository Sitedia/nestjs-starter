import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ApplicationLogger } from '../loggers/application.logger';

const DELAY_WARNING_THRESHOLD = 1000;

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: ApplicationLogger) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: IncomingMessage = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();

    // Log before
    const clientRequest = `${request.method} ${request.url}`;
    this.logger.debug(clientRequest, RequestInterceptor.name);

    // Handle and log response status
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const message = `${clientRequest} | ${response.statusCode} | ${delay}ms`;
        if (delay >= DELAY_WARNING_THRESHOLD) {
          this.logger.warn(message, RequestInterceptor.name);
        } else {
          this.logger.verbose(message, RequestInterceptor.name);
        }
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = `${clientRequest} | ${status} | ${delay}ms | ${error.message}`;

        // Log server NestJS errors
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
          this.logger.error(message, error.stack, RequestInterceptor.name);
        } else {
          this.logger.warn(message, RequestInterceptor.name);
        }

        return throwError(() => error);
      }),
    );
  }
}
