import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreateTripHandler } from '.';
import { TripEntity } from '../../entities';
import { CreateTripRequestDto } from '../../dtos';
import { CreateTripCommand } from '../impl';
import { LoggerService } from '../../../../infrastructure/logging';
import { driverMock } from '../../../drivers/commands/handlers/create-driver.handler.spec';
import { passengerMock } from '../../../passengers/commands/handlers/create-passenger.handler.spec';
import { DriverEntity } from '../../../drivers/entities';
import { PassengerEntity } from '../../../passengers/entities';
import { NotFoundException } from '@nestjs/common';

const createTripReqMock: CreateTripRequestDto = {
  passengerId: 1,
  driverId: 1,
  latTo: '123.123123',
  latFrom: '321.312321',
  lngTo: '-123.123123',
  lngFrom: '-321.321321',
};

const tripMock: TripEntity = {
  ...createTripReqMock,
  passengerId: passengerMock,
  driverId: driverMock,
  id: 1,
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateTripHandler', () => {
  let handler: CreateTripHandler;
  let tripRepository: MockProxy<Repository<TripEntity>>;
  let driverRepository: MockProxy<Repository<DriverEntity>>;
  let passengerRepository: MockProxy<Repository<PassengerEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTripHandler,
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

    handler = module.get<CreateTripHandler>(CreateTripHandler);
    tripRepository = module.get(getRepositoryToken(TripEntity));
    driverRepository = module.get(getRepositoryToken(DriverEntity));
    passengerRepository = module.get(getRepositoryToken(PassengerEntity));
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new trip', async () => {
    driverRepository.findOne.mockResolvedValue(driverMock);
    passengerRepository.findOne.mockResolvedValue(passengerMock);

    tripRepository.create.mockReturnValue(tripMock);
    tripRepository.save.mockResolvedValue(tripMock);

    const response = await handler.execute(
      new CreateTripCommand(createTripReqMock),
    );

    expect(response).toEqual(tripMock);
    expect(tripRepository.create).toHaveBeenCalled();
  });

  it('should throw an exception due to driver does not exists', async () => {
    driverRepository.findOne.mockResolvedValue(null);

    expect(async () => {
      await handler.execute(new CreateTripCommand(createTripReqMock));
    }).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception due to driver does not exists', async () => {
    driverRepository.findOne.mockResolvedValue(driverMock);
    passengerRepository.findOne.mockResolvedValue(null);

    expect(async () => {
      await handler.execute(new CreateTripCommand(createTripReqMock));
    }).rejects.toThrow(NotFoundException);
  });
});
