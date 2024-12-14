import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetDriverHandler } from '.';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { GetDriverQuery } from '../impl';
import { NotFoundException } from '@nestjs/common';

const driverMock: DriverEntity = {
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
};

describe('GetDriverHandler', () => {
  let handler: GetDriverHandler;
  let driverRepository: MockProxy<Repository<DriverEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDriverHandler,
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

    handler = module.get<GetDriverHandler>(GetDriverHandler);
    driverRepository = module.get(getRepositoryToken(DriverEntity));
  });

  it('should return a driver by id', async () => {
    driverRepository.findOne.mockResolvedValueOnce(driverMock);

    const res = await handler.execute(new GetDriverQuery(1));

    expect(res).toEqual(driverMock);
    expect(driverRepository.findOne).toHaveBeenCalled();
  });

  it('should return an error due to driver does not exists', async () => {
    driverRepository.findOne.mockResolvedValueOnce(null);

    expect(async () => {
      await handler.execute(new GetDriverQuery(1));
    }).rejects.toThrow(NotFoundException);
  });
});
