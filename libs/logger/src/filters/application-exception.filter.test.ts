/* Copyright (C) 2024 My company - All Rights Reserved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, ForbiddenException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ExceptionDTO } from '../dto/exception.dto';
import { ApplicationExceptionFilter, INTERNAL_SERVER_ERROR_MESSAGE } from './application-exception.filter';

describe('exception filter', () => {
  it('should return a client exception with the message', async () => {
    expect.assertions(2);
    const applicationExceptionFilter = new ApplicationExceptionFilter();

    // Create a client exception
    const clientException = new ForbiddenException('My message');

    let responseStatus: HttpStatus;
    let result: ExceptionDTO;
    const responseMock = {
      status: (status) => ({
        json: (response) => {
          responseStatus = status;
          result = response;
        },
      }),
    };
    const hostMock = {
      switchToHttp: () => ({
        getRequest: () => ({ url: 'http://localhost/my-query' }),
        getResponse: () => responseMock,
      }),
    };
    applicationExceptionFilter.catch(clientException, hostMock as ArgumentsHost);
    expect(responseStatus).toBe(HttpStatus.FORBIDDEN);
    expect(result.message).toBe('My message');
  });

  it('should return a server exception without the message', async () => {
    expect.assertions(2);
    const applicationExceptionFilter = new ApplicationExceptionFilter();

    // Create a client exception
    const clientException = new InternalServerErrorException('My internal error');

    let responseStatus: HttpStatus;
    let result: ExceptionDTO;
    const responseMock = {
      status: (status) => ({
        json: (response) => {
          responseStatus = status;
          result = response;
        },
      }),
    };
    const hostMock = {
      switchToHttp: () => ({
        getRequest: () => ({ url: 'http://localhost/my-query' }),
        getResponse: () => responseMock,
      }),
    };
    applicationExceptionFilter.catch(clientException, hostMock as ArgumentsHost);
    expect(responseStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.message).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });
});
