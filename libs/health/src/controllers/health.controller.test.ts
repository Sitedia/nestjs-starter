/* Copyright (C) 2024 My company - All Rights Reserved */
import { LoggerModule } from '@company/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from '../health.module';
import { HealthController } from './health.controller';

const setup = async () => {
  const app: TestingModule = await Test.createTestingModule({
    imports: [HealthModule, LoggerModule.register({ global: true })],
  }).compile();

  return app.get(HealthController);
};

describe('health endpoint', () => {
  it('should return the status of the application', async () => {
    expect.assertions(1);
    const healthController = await setup();
    const healthCheckStatus = await healthController.check();
    expect(healthCheckStatus.status).toBe('ok');
  });
});
