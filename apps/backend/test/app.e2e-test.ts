import * as request from 'supertest';
import { bootstrap } from '../src/main';

const setup = async () => {
  return bootstrap('TEST');
};

describe('given the application is starting', () => {
  describe('when running in development environment', () => {
    it('then I expect to know its health status', async () => {
      expect.assertions(2);
      jest.resetModules();
      process.env.APP_TLS_ENABLED = 'false';
      const application = await setup();
      const httpServer = application.getHttpServer();
      const response = await request(httpServer).get('/api/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('when running in development environment on a specific port', () => {
    it('then I expect the application to start accordingly', async () => {
      expect.assertions(2);
      jest.resetModules();
      process.env.APP_TLS_ENABLED = 'false';
      process.env.PORT = '3001';
      const application = await setup();
      const httpServer = application.getHttpServer();
      const response = await request(httpServer).get('/api/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('when running in production environment', () => {
    it('then I expect to know its health status', async () => {
      expect.assertions(2);
      jest.resetModules();
      process.env.PORT = '443';
      process.env.APP_SWAGGER_UI_ENABLED = 'false';
      process.env.APP_LOG_FORMAT = 'JSON';
      const application = await setup();
      const httpServer = application.getHttpServer();
      const response = await request(httpServer).get('/api/health');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});
