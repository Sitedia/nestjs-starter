/* eslint-disable unicorn/prefer-module */
import { LogFormat } from '@company/nestjs-common';
import { HttpStatus } from '@nestjs/common';
import * as fs from 'node:fs';
import * as request from 'supertest';
import { bootstrap } from '../src/main';
import { ApplicationMode } from '../src/models/application-model.enum';

describe('nestjs application', () => {
  it('should display the status of the application', async () => {
    expect.assertions(2);
    delete process.env.PORT;
    delete process.env.APP_RATE_LIMIT_TTL;
    delete process.env.APP_RATE_LIMIT_LIMIT;
    process.env.APP_TLS_ENABLED = 'false';
    process.env.APP_SWAGGER_UI_ENABLED = 'true';
    process.env.APP_LOG_FORMAT = 'CONSOLE';
    const application = await bootstrap(ApplicationMode.TEST);
    const httpServer = application.getHttpServer();
    const response = await request(httpServer).get('/api/health');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body.status).toBe('ok');
  });

  it('should be able to start on a specific port', async () => {
    expect.assertions(2);
    jest.resetModules();
    process.env.PORT = '3001';
    process.env.APP_TLS_ENABLED = 'false';
    process.env.APP_SWAGGER_UI_ENABLED = 'true';
    process.env.APP_LOG_FORMAT = LogFormat.CONSOLE;
    const application = await bootstrap(ApplicationMode.TEST);
    const httpServer = application.getHttpServer();
    const response = await request(httpServer).get('/api/health');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body.status).toBe('ok');
  });

  it('should start in production environment using HTTPs', async () => {
    expect.assertions(1);
    process.env.PORT = '3001';
    process.env.APP_TLS_ENABLED = 'true';
    process.env.APP_SWAGGER_UI_ENABLED = 'false';
    process.env.APP_LOG_FORMAT = 'JSON';
    process.env.APP_RATE_LIMIT_TTL = '1000';
    process.env.APP_RATE_LIMIT_LIMIT = '1000';
    const application = await bootstrap(ApplicationMode.SERVER);
    const httpServer = application.getHttpServer();

    expect(httpServer).toBeDefined();
  });

  it('should generate the API specification in SWAGGER mode', async () => {
    expect.assertions(1);
    process.env.PORT = '3001';
    process.env.APP_TLS_ENABLED = 'false';
    process.env.APP_SWAGGER_UI_ENABLED = 'true';
    process.env.APP_LOG_FORMAT = LogFormat.CONSOLE;
    const application = await bootstrap(ApplicationMode.SWAGGER);
    await application.close();
    expect(fs.existsSync(__dirname + '/../src/openapi.json')).toBe(true);
  });
});
