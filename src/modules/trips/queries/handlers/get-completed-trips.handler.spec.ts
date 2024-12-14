import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetCompletedTripsHandler } from '.';
import { TripEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { driverMock } from '../../../drivers/commands/handlers/create-driver.handler.spec';
import { passengerMock } from '../../../passengers/commands/handlers/create-passenger.handler.spec';

const tripsMock: TripEntity[] = [
  {
    id: 1,
    passengerId: passengerMock,
    driverId: driverMock,
    latTo: '123.123123',
    latFrom: '321.312321',
    lngTo: '-123.123123',
    lngFrom: '-321.321321',
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GetCompletedTripsHandler', () => {
  let handler: GetCompletedTripsHandler;
  let tripRepository: MockProxy<Repository<TripEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCompletedTripsHandler,
        {
          provide: getRepositoryToken(TripEntity),
          useValue: mock<Repository<TripEntity>>(),
        },
        {
          provide: LoggerService,
          useValue: { info: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetCompletedTripsHandler>(GetCompletedTripsHandler);
    tripRepository = module.get(getRepositoryToken(TripEntity));
  });

  it('should return completed trips', async () => {
    tripRepository.find.mockResolvedValueOnce(tripsMock);

    const res1 = await handler.execute();

    expect(res1).toEqual(tripsMock);
    expect(tripRepository.find).toHaveBeenCalled();

    tripRepository.find.mockResolvedValueOnce([]);

    const res2 = await handler.execute();

    expect(res2).toEqual([]);
    expect(tripRepository.find).toHaveBeenCalled();
  });
});
