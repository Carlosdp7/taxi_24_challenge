import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreatePassengerHandler } from '.';
import { PassengerEntity } from '../../entities';
import { CreatePassengerRequestDto } from '../../dtos';
import { CreatePassengerCommand } from '../impl';
import { LoggerService } from '../../../../infrastructure/logging';
import { BadRequestException } from '@nestjs/common';

const createPassengerMock: CreatePassengerRequestDto = {
  name: 'John Doe',
};

export const passengerMock: PassengerEntity = {
  ...createPassengerMock,
  id: 1,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreatePassengerHandler', () => {
  let handler: CreatePassengerHandler;
  let passengerRepository: MockProxy<Repository<PassengerEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePassengerHandler,
        {
          provide: getRepositoryToken(PassengerEntity),
          useValue: mock<Repository<PassengerEntity>>(),
        },
        {
          provide: LoggerService,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreatePassengerHandler>(CreatePassengerHandler);
    passengerRepository = module.get(getRepositoryToken(PassengerEntity));
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new passenger', async () => {
    passengerRepository.create.mockReturnValue(passengerMock);
    passengerRepository.save.mockResolvedValue(passengerMock);

    const response = await handler.execute(
      new CreatePassengerCommand(createPassengerMock),
    );

    expect(response).toEqual(passengerMock);
    expect(passengerRepository.create).toHaveBeenCalled();
  });
});
