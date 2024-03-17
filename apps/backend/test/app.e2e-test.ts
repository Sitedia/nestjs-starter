import * as fs from 'node:fs';
import * as request from 'supertest';
import { bootstrap } from '../src/main';

const setup = async () => {
  return bootstrap('TEST');
};

describe('given the application is starting', () => {
  describe('when running in development environment', () => {
    it('then I expect to know its health status', async () => {
      expect.assertions(2);
      delete process.env.PORT;
      process.env.APP_TLS_ENABLED = 'false';
      process.env.APP_SWAGGER_UI_ENABLED = 'true';
      process.env.APP_LOG_FORMAT = 'CONSOLE';
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
      process.env.PORT = '3001';
      process.env.APP_TLS_ENABLED = 'false';
      process.env.APP_SWAGGER_UI_ENABLED = 'true';
      process.env.APP_LOG_FORMAT = 'CONSOLE';
      const application = await setup();
      const httpServer = application.getHttpServer();
      const response = await request(httpServer).get('/api/health');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('when running in production environment', () => {
    it('then I expect to start with HTTPs', async () => {
      expect.assertions(1);
      process.env.PORT = '3001';
      process.env.APP_TLS_ENABLED = 'true';
      process.env.APP_SWAGGER_UI_ENABLED = 'false';
      process.env.APP_LOG_FORMAT = 'JSON';
      const application = await bootstrap('LISTEN');
      const httpServer = application.getHttpServer();

      expect(httpServer).toBeDefined();
    });
  });

  describe('when running in Swagger mode', () => {
    it('then I expect to exit the application after the file generation', async () => {
      expect.assertions(1);
      process.env.PORT = '3001';
      process.env.APP_TLS_ENABLED = 'false';
      process.env.APP_SWAGGER_UI_ENABLED = 'true';
      process.env.APP_LOG_FORMAT = 'CONSOLE';
      const application = await bootstrap('SWAGGER');
      await application.close();
      expect(fs.existsSync('openapi.json')).toBe(true);
    });
  });
});
