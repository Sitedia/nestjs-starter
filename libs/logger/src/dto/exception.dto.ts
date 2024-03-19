/* Copyright (C) 2024 My company - All Rights Reserved */
import { HttpStatus } from '@nestjs/common';

export class ExceptionDTO {
  message: string;

  statusCode: HttpStatus;

  timestamp: string;

  path?: string;
}
