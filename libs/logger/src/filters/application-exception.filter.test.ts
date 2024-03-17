/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForbiddenException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ExceptionDTO } from '../dto/exception.dto';
import { ApplicationExceptionFilter, INTERNAL_SERVER_ERROR_MESSAGE } from './application-exception.filter';

describe('catch exceptions', () => {
  it('should return client exception message', async () => {
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
    const hostMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({ url: 'http://localhost/my-query' }),
        getResponse: () => responseMock,
      }),
    };
    applicationExceptionFilter.catch(clientException, hostMock);
    expect(responseStatus).toBe(HttpStatus.FORBIDDEN);
    expect(result.message).toBe('My message');
  });

  it('should not return server exception message', async () => {
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
    const hostMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({ url: 'http://localhost/my-query' }),
        getResponse: () => responseMock,
      }),
    };
    applicationExceptionFilter.catch(clientException, hostMock);
    expect(responseStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.message).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });
});
