import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CompleteTripHandler } from '.';
import { TripEntity } from '../../entities';
import { CompleteTripCommand } from '../impl';
import { LoggerService } from '../../../../infrastructure/logging';
import { driverMock } from '../../../drivers/commands/handlers/create-driver.handler.spec';
import { passengerMock } from '../../../passengers/commands/handlers/create-passenger.handler.spec';
import { DriverEntity } from '../../../drivers/entities';
import { PassengerEntity } from '../../../passengers/entities';
import { NotFoundException } from '@nestjs/common';

const tripMock: TripEntity = {
  passengerId: passengerMock,
  driverId: driverMock,
  id: 1,
  latTo: '123.123123',
  latFrom: '321.312321',
  lngTo: '-123.123123',
  lngFrom: '-321.321321',
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CompleteTripHandler', () => {
  let handler: CompleteTripHandler;
  let tripRepository: MockProxy<Repository<TripEntity>>;
  let driverRepository: MockProxy<Repository<DriverEntity>>;
  let passengerRepository: MockProxy<Repository<PassengerEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompleteTripHandler,
        {
          provide: getRepositoryToken(TripEntity),
          useValue: mock<Repository<TripEntity>>(),
        },
        {
          provide: getRepositoryToken(DriverEntity),
          useValue: mock<Repository<DriverEntity>>(),
        },
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

    handler = module.get<CompleteTripHandler>(CompleteTripHandler);
    tripRepository = module.get(getRepositoryToken(TripEntity));
    driverRepository = module.get(getRepositoryToken(DriverEntity));
    passengerRepository = module.get(getRepositoryToken(PassengerEntity));
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should complete a trip', async () => {
    tripRepository.findOne.mockResolvedValue(tripMock);

    driverRepository.findOne.mockResolvedValue(driverMock);
    passengerRepository.findOne.mockResolvedValue(passengerMock);

    const response = await handler.execute(new CompleteTripCommand(1));

    expect(response).toEqual(tripMock);
  });

  it('should throw an exception due to trip does not exists', async () => {
    tripRepository.findOne.mockResolvedValue(null);

    expect(async () => {
      await handler.execute(new CompleteTripCommand(1));
    }).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception due to driver does not exists', async () => {
    tripRepository.findOne.mockResolvedValue(tripMock);
    driverRepository.findOne.mockResolvedValue(null);

    expect(async () => {
      await handler.execute(new CompleteTripCommand(1));
    }).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception due to driver does not exists', async () => {
    tripRepository.findOne.mockResolvedValue(tripMock);
    driverRepository.findOne.mockResolvedValue(driverMock);
    passengerRepository.findOne.mockResolvedValue(null);

    expect(async () => {
      await handler.execute(new CompleteTripCommand(1));
    }).rejects.toThrow(NotFoundException);
  });
});
