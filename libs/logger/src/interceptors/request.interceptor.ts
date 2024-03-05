import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { Observable } from 'rxjs';
import { ApplicationLogger } from '../loggers/application.logger';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: ApplicationLogger) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: IncomingMessage = context.switchToHttp().getRequest();
    this.logger.log(
      `${request.method} ${request.url}`,
      RequestInterceptor.name,
    );
    return next.handle();
  }
}
