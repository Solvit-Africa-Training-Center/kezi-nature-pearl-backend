import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let errorResponse: any;

    if (exception instanceof HttpException) {
      ({ status, errorResponse } = this.handleHttpException(
        exception,
        request,
      ));
    } else if (exception instanceof QueryFailedError) {
      ({ status, errorResponse } = this.handleQueryFailedError(
        exception,
        request,
      ));
    } else if (exception instanceof Error) {
      ({ status, errorResponse } = this.handleGenericError(exception, request));
    } else {
      ({ status, errorResponse } = this.handleUnknownError(exception, request));
    }

    this.logException(exception, request, status);

    response.status(status).json(errorResponse);
  }

  private handleHttpException(exception: HttpException, request: Request) {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : exceptionResponse),
    };

    return { status, errorResponse };
  }

  private handleQueryFailedError(
    exception: QueryFailedError,
    request: Request,
  ) {
    const driverError: any = exception.driverError;

    let status = 500;
    let message = 'Database operation failed';

    if (driverError?.code === '23505') {
      status = 409;
      message = 'Duplicate entry found';
    }

    return {
      status,
      errorResponse: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        errorCode: 'DATABASE_ERROR',
      },
    };
  }

  private handleGenericError(exception: Error, request: Request) {
    return {
      status: 500,
      errorResponse: {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message || 'Internal server error',
        errorCode: 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV !== 'production' && {
          stack: exception.stack,
        }),
      },
    };
  }

  private handleUnknownError(exception: unknown, request: Request) {
    return {
      status: 500,
      errorResponse: {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'An unknown error occurred',
        errorCode: 'UNKNOWN_ERROR',
      },
    };
  }

  private logException(exception: unknown, request: Request, status: number) {
    const logMessage = `[${request.method}] ${request.url} - Status: ${status}`;

    if (status >= 500) {
      this.logger.error(
        `${logMessage}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`${logMessage}`);
    }
  }
}
