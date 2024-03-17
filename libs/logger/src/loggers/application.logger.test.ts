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
      expect.assertions(2);
      const { logger } = await setup(undefined, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

      // Write warn log
      const messageWarn = logger.formatMessage(
        'warn',
        'Test',
        '1000',
        'fatal',
        'ApplicationLoggerTest',
        new Date().toISOString(),
      );
      expect(messageWarn).not.toContain('{');

      // Write log
      const messageLog = logger.formatMessage(
        'log',
        'Test',
        '1000',
        'fatal',
        'ApplicationLoggerTest',
        new Date().toISOString(),
      );
      expect(messageLog).not.toContain('{');
    });
  });

  describe('when the log format is JSON', () => {
    it('then I expect to see all logs in JSON, without color', async () => {
      expect.assertions(2);
      const { logger } = await setup('JSON', ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

      // Write warn log
      const messageWarn = logger.formatMessage(
        'warn',
        'Test',
        '1000',
        'fatal',
        'ApplicationLoggerTest',
        new Date().toISOString(),
      );
      expect(messageWarn).toContain('{');

      // Write log
      const messageLog = logger.formatMessage(
        'log',
        'Test',
        '1000',
        'fatal',
        'ApplicationLoggerTest',
        new Date().toISOString(),
      );
      expect(messageLog).toContain('{');
    });
  });

  it('then I can use the default configuration', async () => {
    expect.assertions(1);
    const { logger, loggerSpy } = await setup(undefined, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);
    loggerSpy.mockImplementation(() => '');

    // Write logs
    logger.warn('Console warn', 'Test');
    logger.log('Console log', 'Test');

    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('then I can use the JSON configuration', async () => {
    expect.assertions(1);
    const { logger, loggerSpy } = await setup('JSON');
    loggerSpy.mockImplementation(() => '');

    // Write logs
    logger.fatal('JSON fatal');
    logger.error('JSON error');

    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});
