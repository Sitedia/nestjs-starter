/* Copyright (C) 2024 My company - All Rights Reserved */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationLogger } from '@company/logger';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { delay, lastValueFrom, of, throwError } from 'rxjs';
import { RequestInterceptor } from './request.interceptor';

// Create a mock context for all interceptors in the tests
const contextMock = {
  switchToHttp: () => ({
    getRequest: () => ({ url: 'http://localhost/my-query' }),
    getResponse: () => ({ statusCode: 200 }),
  }),
};

// Setup each test
const setup = async () => {
  const logger = new ApplicationLogger({
    logLevels: [], // Disable all logs
    logFormat: 'CONSOLE',
  });

  return new RequestInterceptor(logger);
};

describe('request interceptor', () => {
  it('should intercept the requests', async () => {
    expect.assertions(1);
    const requestInterceptor = await setup();

    // Mock the handler
    const handlerMock = {
      handle: () => of({ username: 'admin' }),
    };

    const observable = requestInterceptor.intercept(contextMock as ExecutionContext, handlerMock);
    const result = await lastValueFrom(observable);
    expect(result.username).toBe('admin');
  });

  it('should warn if the response delay is too long', async () => {
    expect.assertions(1);
    const requestInterceptor = await setup();

    // Mock the handler
    const delayMs = 1500;
    const handlerMock = {
      handle: () => of({ username: 'admin' }).pipe(delay(delayMs)),
    };

    const observable = requestInterceptor.intercept(contextMock as ExecutionContext, handlerMock);
    const result = await lastValueFrom(observable);
    expect(result.username).toBe('admin');
  });

  it('should log client errors', async () => {
    expect.assertions(1);
    const requestInterceptor = await setup();

    // Mock the handler
    const handlerMock = {
      handle: () => throwError(() => new ForbiddenException('My error')),
    };

    const observable = requestInterceptor.intercept(contextMock as ExecutionContext, handlerMock);
    await expect(lastValueFrom(observable)).rejects.toThrow('My error');
  });

  it('should log the internal server errors', async () => {
    expect.assertions(1);
    const requestInterceptor = await setup();

    // Mock the handler
    const handlerMock = {
      handle: () => throwError(() => new Error('Internal error')),
    };

    const observable = requestInterceptor.intercept(contextMock as ExecutionContext, handlerMock);
    await expect(lastValueFrom(observable)).rejects.toThrow('Internal error');
  });
});
