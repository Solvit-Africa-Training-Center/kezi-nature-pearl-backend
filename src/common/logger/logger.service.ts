import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { logger } from './logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;
  private context: string;

  constructor() {
    this.logger = logger;
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string | Record<string, any>) {
    this.logger.info({ message, context: this.context });
  }
  error(message: string | Record<string, any>, trace?: string) {
    this.logger.error({ message, trace, context: this.context });
  }
  warn(message: string | Record<string, any>) {
    this.logger.warn({ message, context: this.context });
  }
  debug(message: string | Record<string, any>) {
    this.logger.debug({ message, context: this.context });
  }
  verbose(message: string | Record<string, any>) {
    this.logger.debug({ message, context: this.context });
  }
  // fatal?(message: any, ...optionalParams: any[]) {
  //   throw new Error('Method not implemented.');
  // }
  // setLogLevels?(levels: LogLevel[]) {
  //   throw new Error('Method not implemented.');
  // }
}
