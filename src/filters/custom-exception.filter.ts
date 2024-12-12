import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { LoggerService } from '../logging';

export interface ErrorDetail {
  type: string;
  message: string | object;
  timestamp: string;
  path: string;
  method: string;
}

export interface ErrorResponse {
  error: ErrorDetail;
}

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const errorHandler = ErrorHandlerFactory.create(
      this._logger,
      exception,
      request,
      response,
    );
    return errorHandler.handle();
  }
}

abstract class GenericErrorHandler<T extends Error> {
  constructor(
    protected readonly _logger: LoggerService,
    protected readonly exception: T,
    protected readonly request,
    protected readonly response,
  ) {}

  abstract httpStatus: number;
  abstract errorType: string;
  abstract errorMessage: string | Record<string, any>;

  public handle() {
    this.logError();
    const errorResponse: ErrorResponse = { error: this.getErrorDetail() };
    return this.response.status(this.httpStatus).json(errorResponse);
  }

  abstract logError();

  public getErrorDetail(): ErrorDetail {
    return {
      type: this.errorType,
      message: this.errorMessage,
      timestamp: new Date().toISOString(),
      path: this.request.url,
      method: this.request.method,
    };
  }
}

class UnknownErrorHandler extends GenericErrorHandler<Error> {
  override httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
  override errorType = 'InternalServerError';
  override errorMessage = 'Internal server error';

  override logError() {
    this._logger.error(
      this.exception.message,
      this.exception.stack,
      `${this.request.method} ${this.request.url}`,
    );
  }
}

class HttpErrorHandler extends GenericErrorHandler<HttpException> {
  override httpStatus: number = this.exception.getStatus();
  override errorType: string = this.exception.name;
  override errorMessage: string | object = this.getErrorMessage();

  override logError() {
    this._logger.error(
      `${JSON.stringify(this.getErrorDetail())}`,
      '',
      `${this.request.method} ${this.request.url}`,
    );
  }

  private getErrorMessage(): string | object {
    if (this.isValidationPipe(this.exception.getResponse())) {
      return this.exception.getResponse()['message'];
    }

    if (isObject(this.exception.getResponse())) {
      return this.exception.getResponse();
    }

    return this.exception.message;
  }

  private isValidationPipe(responseInException: any) {
    return (
      isObject(responseInException) &&
      responseInException['message'] != undefined
    );
  }
}

class ErrorHandlerFactory {
  public static create(
    _logger: LoggerService,
    exception: Error,
    request,
    response,
  ) {
    if (exception instanceof HttpException)
      return new HttpErrorHandler(_logger, exception, request, response);
    else return new UnknownErrorHandler(_logger, exception, request, response);
  }
}
