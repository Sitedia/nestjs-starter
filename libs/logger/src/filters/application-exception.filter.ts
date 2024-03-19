/* Copyright (C) 2024 My company - All Rights Reserved */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionDTO } from '../dto/exception.dto';

export const INTERNAL_SERVER_ERROR_MESSAGE = 'An internal server error occurred';

@Catch(HttpException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    const message =
      exception.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR ? exception.message : INTERNAL_SERVER_ERROR_MESSAGE;

    const payload: ExceptionDTO = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(payload);
  }
}
