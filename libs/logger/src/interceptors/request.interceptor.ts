import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { ApplicationLogger } from '../loggers/application.logger';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: ApplicationLogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request: IncomingMessage = context.switchToHttp().getRequest();
    this.logger.log(
      `${request.method} ${request.url}`,
      RequestInterceptor.name,
    );
    return next.handle();
  }
}
