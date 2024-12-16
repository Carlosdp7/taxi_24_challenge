import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetNearestDriversHandler } from '.';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { GetNearestDriversQuery } from '../impl';

const driversMock: DriverEntity[] = [
  {
    id: 1,
    name: 'John Doe',
    car_brand: 'Toyota',
    car_color: 'Black',
    car_plate: 'XYZ 123',
    isAvailable: true,
    latitude: '28.532426667896694',
    longitude: '-81.36939582360586',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'John Doe',
    car_brand: 'Toyota',
    car_color: 'Black',
    car_plate: 'XYZ 123',
    isAvailable: true,
    latitude: '28.50344568892073',
    longitude: '-81.40690682887701',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'John Doe',
    car_brand: 'Toyota',
    car_color: 'Black',
    car_plate: 'XYZ 123',
    isAvailable: true,
    latitude: '28.535430036923547',
    longitude: '-81.37156430218083',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'John Doe',
    car_brand: 'Toyota',
    car_color: 'Black',
    car_plate: 'XYZ 123',
    isAvailable: true,
    latitude: '28.541244330283188',
    longitude: '-81.3710348261409',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GetNearestDriversHandler', () => {
  let handler: GetNearestDriversHandler;
  let driverRepository: MockProxy<Repository<DriverEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNearestDriversHandler,
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

    handler = module.get<GetNearestDriversHandler>(GetNearestDriversHandler);
    driverRepository = module.get(getRepositoryToken(DriverEntity));
  });

  it('should return nearest drivers', async () => {
    driverRepository.find.mockResolvedValueOnce(driversMock);

    const res1 = await handler.execute(
      new GetNearestDriversQuery({
        latitude: '28.535989664525733',
        longitude: '-81.37246239812623',
      }),
    );

    expect(res1.length).toEqual(3);
    expect(driverRepository.find).toHaveBeenCalled();
  });
});
