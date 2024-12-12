import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller } from '@nestjs/common';

@Controller()
export class DriversController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}
}
