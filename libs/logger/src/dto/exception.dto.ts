import { HttpStatus } from '@nestjs/common';

export class ExceptionDTO {
  message: string;

  statusCode: HttpStatus;

  timestamp: string;

  path?: string;
}
