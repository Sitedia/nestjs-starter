import { ArgumentsHost, ForbiddenException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ExceptionDTO } from '../dto/exception.dto';
import { ApplicationExceptionFilter, INTERNAL_SERVER_ERROR_MESSAGE } from './application-exception.filter';

describe('exception filter', () => {
  it('should return a client exception with the message', async () => {
    expect.assertions(2);

    // Create a mock to intercept the exception
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

    // Trigger the exception
    const applicationExceptionFilter = new ApplicationExceptionFilter();
    applicationExceptionFilter.catch(new ForbiddenException('My message'), hostMock as ArgumentsHost);

    expect(responseStatus).toBe(HttpStatus.FORBIDDEN);
    expect(result.message).toBe('My message');
  });

  it('should return a server exception without the message', async () => {
    expect.assertions(2);

    // Create a mock to intercept the exception
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

    // Trigger the exception
    const applicationExceptionFilter = new ApplicationExceptionFilter();
    applicationExceptionFilter.catch(new InternalServerErrorException('My internal error'), hostMock as ArgumentsHost);

    expect(responseStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.message).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });
});
