import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Structure of the exception returned to the client in the HTTP response
 */
export class ExceptionDTO {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path?: string;
}
