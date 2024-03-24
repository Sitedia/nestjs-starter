import { ApplicationLogger, LogFormat, LoggerModule } from '@company/nestjs-common';
import { LogLevel } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

/**
 * Sets up each test with customizable context
 */
const setup = async (logFormat?: LogFormat, logLevels?: LogLevel[]) => {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [LoggerModule.register({ logFormat, logLevels })],
  }).compile();

  return testingModule.get(ApplicationLogger);
};

describe('application logger', () => {
  it('should display text in CONSOLE mode', async () => {
    expect.assertions(2);
    const logger = await setup(undefined, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

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

  it('should display text in JSON mode', async () => {
    expect.assertions(2);
    const logger = await setup(LogFormat.JSON, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

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

  it('should handle different log levels in CONSOLE mode', async () => {
    expect.assertions(1);
    const logger = await setup(undefined, ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']);

    // Add a spy on the logger when formatting the message
    const loggerSpy = jest.spyOn(logger, 'formatMessage');
    loggerSpy.mockImplementation(() => '');

    // Write logs
    logger.warn('Console warn', 'Test');
    logger.log('Console log', 'Test');

    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle different log levels in JSON mode', async () => {
    expect.assertions(1);
    const logger = await setup(LogFormat.JSON);

    // Add a spy on the logger when formatting the message
    const loggerSpy = jest.spyOn(logger, 'formatMessage');
    loggerSpy.mockImplementation(() => '');

    // Write logs
    logger.fatal('JSON fatal');
    logger.error('JSON error');

    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});
