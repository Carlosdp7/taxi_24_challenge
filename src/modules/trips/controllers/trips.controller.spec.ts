import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MockProxy, mock } from 'jest-mock-extended';
import { TripsController } from './trips.controller';

describe('Drivers Controller', () => {
  let controller: TripsController;
  let queryBus: MockProxy<QueryBus>;
  let commandBus: MockProxy<CommandBus>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: CommandBus,
          useValue: mock<CommandBus>(),
        },
        {
          provide: QueryBus,
          useValue: mock<QueryBus>(),
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('test', () => {
    expect('Hola').toEqual('Hola');
  });
});
