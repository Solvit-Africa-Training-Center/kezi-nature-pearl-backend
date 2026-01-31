import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const baseFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // include stack trace in errors
  format.splat(), // allow printf-style formatting
);

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    const base = `[${timestamp}] ${level}:`;
    const msg =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return stack ? `${base} ${msg}\n${stack}` : `${base} ${msg}`;
  }),
);

export const logger = createLogger({
  level: 'info',
  format: baseFormat,
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),

    new DailyRotateFile({
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM/DD',
      dirname: 'logs',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
      format: format.json(),
    }),

    new DailyRotateFile({
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM/DD',
      dirname: 'logs',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: format.json(),
    }),
  ],
  exitOnError: false,
});
