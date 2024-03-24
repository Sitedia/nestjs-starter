import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { constants } from '../../constants/constants';
import { ExceptionDTO } from '../dto/exception.dto';

/**
 * This filter always return the same error payload to the user.
 * It also hides the error message in case of internal server errors
 */
@Catch(HttpException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    // We should return the exception message only for client exceptions
    const message =
      exception.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message
        : constants.INTERNAL_SERVER_ERROR_MESSAGE;

    // Payload to return in the HTTP response
    const payload: ExceptionDTO = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(payload);
  }
}
