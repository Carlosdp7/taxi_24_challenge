import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';

import { GetPassengerHandler } from '.';
import { PassengerEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { GetPassengerQuery } from '../impl';
import { NotFoundException } from '@nestjs/common';

const passengerMock: PassengerEntity = {
  id: 1,
  name: 'John Doe',
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GetPassengerHandler', () => {
  let handler: GetPassengerHandler;
  let passengerRepository: MockProxy<Repository<PassengerEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPassengerHandler,
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

    handler = module.get<GetPassengerHandler>(GetPassengerHandler);
    passengerRepository = module.get(getRepositoryToken(PassengerEntity));
  });

  it('should return a driver by id', async () => {
    passengerRepository.findOne.mockResolvedValueOnce(passengerMock);

    const res = await handler.execute(new GetPassengerQuery(1));

    expect(res).toEqual(passengerMock);
    expect(passengerRepository.findOne).toHaveBeenCalled();
  });

  it('should return an error due to driver does not exists', async () => {
    passengerRepository.findOne.mockResolvedValueOnce(null);

    expect(async () => {
      await handler.execute(new GetPassengerQuery(1));
    }).rejects.toThrow(NotFoundException);
  });
});
