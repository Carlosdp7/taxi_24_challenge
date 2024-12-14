import { Injectable, LoggerService as ILoggerService } from '@nestjs/common';
import { createLogger, transports, Logger, format } from 'winston';

@Injectable()
export class LoggerService implements ILoggerService {
  public _logger: Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV == 'prod';

    this._logger = createLogger({
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.Console({
          level: !isProduction ? 'debug' : 'info',
        }),
      ],
    });

    this._logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    if (!isProduction) {
      this._logger.debug('Logging initialized at debug level');
    }
  }

  private baseLog(
    logFunc: (message: any, ...optionalParams: [...any, string?]) => void,
    message: any,
    ...optionalParams: [...any, string?]
  ): void {
    if (typeof message === 'object') {
      if (optionalParams.length) {
        logFunc(JSON.stringify(message), ...optionalParams);
      } else {
        // check that optional parameters array is empty
        logFunc(message);
      }
    } else {
      logFunc(message, ...optionalParams);
    }
  }

  log(message: any, ...optionalParams: [...any, string?]): void {
    this.baseLog(this._logger.info, message, ...optionalParams);
  }
  info(message: any, ...optionalParams: [...any, string?]): void {
    this.baseLog(this._logger.info, message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: [...any, string?]): void {
    this.baseLog(this._logger.debug, message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: [...any, string?]): void {
    this.baseLog(this._logger.warn, message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: [...any, string?]): void {
    this.baseLog(this._logger.verbose, message, ...optionalParams);
  }
  error(message: any, ...optionalParams: [...any]): void {
    if (message instanceof Error) {
      if (optionalParams.length) {
        this._logger.error(message.message, message, ...optionalParams);
      } else {
        // check that optional parameters array is empty
        this._logger.error(message);
      }
    } else {
      this.baseLog(this._logger.error, message, ...optionalParams);
    }
  }
}
