import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  HttpException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CustomExceptionFilter,
  ErrorDetail,
  ErrorResponse,
} from './custom-exception.filter';
import { LoggerService } from '../logging/logger.service';
import { BusinessError } from '../common/base.error';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

const loggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const fakeDate = new Date('2020-01-01');
jest.useFakeTimers().setSystemTime(fakeDate);

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequest,
  getResponse: mockGetResponse,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  url: '/path',
  method: 'GET',
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockJson = jest.fn();

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let exceptionfilter: CustomExceptionFilter;
  let httpService: HttpService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CustomExceptionFilter,
        {
          provide: LoggerService,
          useValue: loggerService,
        },
      ],
    }).compile();
    exceptionfilter = module.get<CustomExceptionFilter>(CustomExceptionFilter);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('Exception filter tests', () => {
    it('Handle Generic exception', async () => {
      let axiosError: AxiosError = new AxiosError();

      try {
        await firstValueFrom(
          httpService.get('/api/xyz/abcd').pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
        );
      } catch (error) {
        axiosError = error;
      }

      exceptionfilter.catch(axiosError, mockArgumentsHost);
      const errorExpected: ErrorDetail = {
        type: 'InternalServerError',
        message: 'Internal server error',
        timestamp: fakeDate.toISOString(),
        path: '/path',
        method: 'GET',
      };

      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      const errorResponse: ErrorResponse = mockJson.mock.calls[0][0];
      const errorDetail: ErrorDetail = errorResponse.error;
      expect(errorDetail).toEqual(errorExpected);
    });

    it('Handle Http exception', () => {
      exceptionfilter.catch(
        new HttpException('Error HTTP Message', HttpStatus.NOT_FOUND),
        mockArgumentsHost,
      );

      const errorExpected: ErrorDetail = {
        type: 'HttpException',
        message: 'Error HTTP Message',
        timestamp: fakeDate.toISOString(),
        path: '/path',
        method: 'GET',
      };

      expect(mockStatus).toBeCalledWith(HttpStatus.NOT_FOUND);
      const errorResponse: ErrorResponse = mockJson.mock.calls[0][0];
      const errorDetail: ErrorDetail = errorResponse.error;
      expect(errorDetail).toEqual(errorExpected);
    });

    it('Handle http Validation Pipe', () => {
      const validationResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email', 'name is required'],
      };

      exceptionfilter.catch(
        new BadRequestException(validationResponse),
        mockArgumentsHost,
      );

      const errorExpected: ErrorDetail = {
        type: 'BadRequestException',
        message: ['email must be an email', 'name is required'],
        timestamp: fakeDate.toISOString(),
        path: '/path',
        method: 'GET',
      };

      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      const errorResponse: ErrorResponse = mockJson.mock.calls[0][0];
      const errorDetail: ErrorDetail = errorResponse.error;
      expect(errorDetail).toEqual(errorExpected);
    });

    it('Handle http Response Objects', () => {
      const objectError = {
        error: 'error ',
        detail: 'some detail',
      };

      exceptionfilter.catch(
        new UnauthorizedException(objectError),
        mockArgumentsHost,
      );

      const errorExpected: ErrorDetail = {
        type: 'UnauthorizedException',
        message: { error: 'error ', detail: 'some detail' },
        timestamp: fakeDate.toISOString(),
        path: '/path',
        method: 'GET',
      };

      expect(mockStatus).toBeCalledWith(HttpStatus.UNAUTHORIZED);
      const errorResponse: ErrorResponse = mockJson.mock.calls[0][0];
      const errorDetail: ErrorDetail = errorResponse.error;
      expect(errorDetail).toEqual(errorExpected);
    });

    it('Handle Business exception', () => {
      class BusinessLogicException extends BusinessError {
        constructor() {
          super('BusinessLogic', 'Invalid business logic');
        }
      }

      exceptionfilter.catch(new BusinessLogicException(), mockArgumentsHost);
      const errorExpected: ErrorDetail = {
        type: 'BusinessLogic',
        message: 'Invalid business logic',
        timestamp: fakeDate.toISOString(),
        path: '/path',
        method: 'GET',
      };

      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      const errorResponse: ErrorResponse = mockJson.mock.calls[0][0];
      const errorDetail: ErrorDetail = errorResponse.error;
      expect(errorDetail).toEqual(errorExpected);
    });
  });
});
