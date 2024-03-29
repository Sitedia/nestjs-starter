import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '../logger-module.definition';
import { LoggerModuleOptions } from '../logger-module.options';
import { LogFormat } from '../models/log-format';

/**
 * Logger with dual mode: CONSOLE or JSON
 */
@Injectable()
export class ApplicationLogger extends ConsoleLogger {
  private readonly logFormat: LogFormat;

  /**
   * Constructor loading the options trom the dynamic Logger module
   */
  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: LoggerModuleOptions) {
    super();
    this.setLogLevels(options.logLevels ?? ['fatal', 'error', 'warn', 'log']);
    this.logFormat = options.logFormat ?? LogFormat.CONSOLE;
  }

  protected formatPid(pid: number) {
    if (this.logFormat === LogFormat.JSON) {
      return `${pid}`;
    }
    return super.formatPid(pid);
  }

  protected colorize(message: string, logLevel: LogLevel) {
    if (this.logFormat === LogFormat.JSON) {
      return message;
    }
    return super.colorize(message, logLevel);
  }

  protected formatContext(context: string): string {
    const contextLength = 18;
    if (this.logFormat === LogFormat.JSON) {
      return context;
    }
    return super.formatContext(context.padEnd(contextLength, ' ').slice(0, contextLength));
  }

  formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const output = this.stringifyMessage(message, logLevel);
    const level = this.colorize(formattedLogLevel, logLevel);
    const timestamp = new Date().toISOString();
    if (this.logFormat === LogFormat.JSON) {
      return `${JSON.stringify({
        pid: pidMessage,
        timestamp,
        level: logLevel === 'log' ? 'info' : logLevel,
        context: contextMessage,
        message: output,
      })}\n`;
    }
    return `${this.colorize(this.getTimestamp(), logLevel)} ${level} ${contextMessage}${output}${timestampDiff}\n`;
  }
}
