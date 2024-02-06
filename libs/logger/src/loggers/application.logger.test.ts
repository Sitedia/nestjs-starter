import { ApplicationLogger, LogFormat, LoggerModule } from '@company/logger';
import { LogLevel } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

const setup = async (logFormat?: LogFormat, logLevels?: LogLevel[]) => {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [LoggerModule.register({ global: true, logFormat, logLevels })],
  }).compile();

  // Add spy on the logger
  const logger = testingModule.get(ApplicationLogger);
  const loggerSpy = jest.spyOn(logger, 'formatMessage');

  return { logger, loggerSpy };
};

describe('given the application is producing logs', () => {
  describe('when the log format is CONSOLE', () => {
    it('then I expect to see each log level with colors', async () => {
      expect.assertions(1);
      const { logger, loggerSpy } = await setup(undefined, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

      // Write logs
      logger.fatal('Log fatal', 'Test');
      logger.error('Log error', 'Test');
      logger.warn('Log warn', 'Test');
      logger.log('Log log', 'Test');
      logger.debug('Log debug', 'Test');
      logger.verbose('Log verbose', 'Test');

      expect(loggerSpy).toHaveBeenCalledTimes(6);
    });
  });

  describe('when the log format is JSON', () => {
    it('then I expect to see all logs in JSON, without color', async () => {
      expect.assertions(1);
      const { logger, loggerSpy } = await setup('JSON', ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

      // Write logs
      logger.fatal('JSON fatal', 'Test');
      logger.error('JSON error', 'Test');
      logger.warn('JSON warn', 'Test');
      logger.log('JSON log', 'Test');
      logger.debug('JSON debug', 'Test');
      logger.verbose('JSON verbose', 'Test');

      expect(loggerSpy).toHaveBeenCalledTimes(6);
    });
  });

  it('then I can use the default configuration', async () => {
    expect.assertions(1);
    const { logger, loggerSpy } = await setup();

    // Write logs
    logger.fatal('JSON fatal', 'Test');
    logger.error('JSON error', 'Test');
    logger.warn('JSON warn', 'Test');
    logger.log('JSON log', 'Test');
    logger.debug('JSON debug', 'Test'); // should not log
    logger.verbose('JSON verbose', 'Test'); // should not log

    expect(loggerSpy).toHaveBeenCalledTimes(4);
  });
});
