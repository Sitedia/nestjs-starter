import { ApplicationLogger } from '@company/logger';
import { Observable } from 'rxjs';
import { RequestInterceptor } from './request.interceptor';

const setup = async () => {
  const logger = new ApplicationLogger({ logLevels: ['fatal', 'error'], logFormat: 'CONSOLE' });

  // Add a spy on the request interceptor
  const requestInterceptor = new RequestInterceptor(logger);
  const requestInterceptorSpy = jest.spyOn(requestInterceptor, 'intercept');

  return { requestInterceptor, requestInterceptorSpy };
};

describe('log incoming requests', () => {
  it('should log the incoming request', async () => {
    expect.assertions(1);
    const { requestInterceptor, requestInterceptorSpy } = await setup();

    // Mock the context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contextMock: any = {
      switchToHttp: () => ({ getRequest: () => ({ url: 'http://localhost/my-query' }) }),
    };

    // Mock the handler
    const handlerMock = {
      handle: () => new Observable(),
    };

    requestInterceptor.intercept(contextMock, handlerMock);
    expect(requestInterceptorSpy).toHaveBeenCalledTimes(1);
  });
});
