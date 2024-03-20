import { HttpStatus } from '@nestjs/common';

/**
 * Structure of the exception returned to the client in the HTTP response.
 */
export class ExceptionDTO {
  message: string;

  statusCode: HttpStatus;

  timestamp: string;

  path?: string;
}
