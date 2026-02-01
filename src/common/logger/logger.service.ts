import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { logger } from './logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = logger;
  }

  log(message: string | Record<string, any>, context?: string) {
    this.logger.info({ message, context });
  }
  error(
    message: string | Record<string, any>,
    trace?: string,
    context?: string,
  ) {
    this.logger.error({ message, trace, context });
  }
  warn(message: string | Record<string, any>, context?: string) {
    this.logger.warn({ message, context });
  }
  debug(message: string | Record<string, any>, context?: string) {
    this.logger.debug({ message, context });
  }
  verbose(message: string | Record<string, any>, context?: string) {
    this.logger.debug({ message, context });
  }
  // fatal?(message: any, ...optionalParams: any[]) {
  //   throw new Error('Method not implemented.');
  // }
  // setLogLevels?(levels: LogLevel[]) {
  //   throw new Error('Method not implemented.');
  // }
}
