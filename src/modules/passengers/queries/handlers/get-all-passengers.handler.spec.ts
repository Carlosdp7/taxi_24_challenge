import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetAllPassengersHandler } from './';
import { PassengerEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

const passengersMock: PassengerEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GetAllPassengersHandler', () => {
  let handler: GetAllPassengersHandler;
  let passengerRepository: MockProxy<Repository<PassengerEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllPassengersHandler,
        {
          provide: getRepositoryToken(PassengerEntity),
          useValue: mock<Repository<PassengerEntity>>(),
        },
        {
          provide: LoggerService,
          useValue: { info: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetAllPassengersHandler>(GetAllPassengersHandler);
    passengerRepository = module.get(getRepositoryToken(PassengerEntity));
  });

  it('should return all the passengers', async () => {
    passengerRepository.find.mockResolvedValueOnce(passengersMock);

    const res1 = await handler.execute();

    expect(res1).toEqual(passengersMock);
    expect(passengerRepository.find).toHaveBeenCalled();

    passengerRepository.find.mockResolvedValueOnce([]);

    const res2 = await handler.execute();

    expect(res2).toEqual([]);
    expect(passengerRepository.find).toHaveBeenCalled();
  });
});
