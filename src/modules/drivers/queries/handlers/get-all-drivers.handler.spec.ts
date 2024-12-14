import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetAllDriversHandler } from './';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

const driversMock: DriverEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    car_brand: 'Toyota',
    car_color: 'Black',
    car_plate: 'XYZ 123',
    isAvailable: true,
    latitude: '123.12231',
    longitude: '-123.1231',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GetAllDriversHandler', () => {
  let handler: GetAllDriversHandler;
  let driverRepository: MockProxy<Repository<DriverEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllDriversHandler,
        {
          provide: getRepositoryToken(DriverEntity),
          useValue: mock<Repository<DriverEntity>>(),
        },
        {
          provide: LoggerService,
          useValue: { info: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<GetAllDriversHandler>(GetAllDriversHandler);
    driverRepository = module.get(getRepositoryToken(DriverEntity));
  });

  it('should return all the drivers', async () => {
    driverRepository.find.mockResolvedValueOnce(driversMock);

    const res1 = await handler.execute();

    expect(res1).toEqual(driversMock);
    expect(driverRepository.find).toHaveBeenCalled();

    driverRepository.find.mockResolvedValueOnce([]);

    const res2 = await handler.execute();

    expect(res2).toEqual([]);
    expect(driverRepository.find).toHaveBeenCalled();
  });
});
