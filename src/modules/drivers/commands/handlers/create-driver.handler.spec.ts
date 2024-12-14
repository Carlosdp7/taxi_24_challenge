import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockProxy, mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { CreateDriverHandler } from '.';
import { DriverEntity } from '../../entities';
import { CreateDriverRequestDto } from '../../dtos';
import { CreateDriverCommand } from '../impl';
import { LoggerService } from '../../../../infrastructure/logging';

const createDriverReqMock: CreateDriverRequestDto = {
  name: 'John Doe',
  car_brand: 'Toyota',
  car_color: 'Black',
  car_plate: 'XYZ 123',
  latitude: '123.12231',
  longitude: '-123.1231',
};

const driverMock: DriverEntity = {
  ...createDriverReqMock,
  id: 1,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateDriverHandler', () => {
  let handler: CreateDriverHandler;
  let driverRepository: MockProxy<Repository<DriverEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDriverHandler,
        {
          provide: getRepositoryToken(DriverEntity),
          useValue: mock<Repository<DriverEntity>>(),
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

    handler = module.get<CreateDriverHandler>(CreateDriverHandler);
    driverRepository = module.get(getRepositoryToken(DriverEntity));
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new challenge', async () => {
    driverRepository.create.mockReturnValue(driverMock);
    driverRepository.save.mockResolvedValue(driverMock);

    const response = await handler.execute(
      new CreateDriverCommand(createDriverReqMock),
    );

    expect(response).toEqual(driverMock);
    expect(driverRepository.create).toHaveBeenCalled();
  });
});
