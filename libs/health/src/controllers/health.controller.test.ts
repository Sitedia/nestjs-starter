import { LoggerModule } from '@company/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from '../health.module';
import { HealthController } from './health.controller';

/**
 * Loads the Health controller to test it
 */
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
