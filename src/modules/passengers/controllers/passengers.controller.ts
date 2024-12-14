import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PassengerEntity } from '../entities';
import { GetAllPassengersQuery, GetPassengerQuery } from '../queries/impl';
import { CreatePassengerRequestDto } from '../dtos';
import { CreatePassengerCommand } from '../commands/impl';

@Controller()
export class PassengersController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}
  @Get('passengers')
  async getAllPassengers(): Promise<PassengerEntity[]> {
    return this._queryBus.execute(new GetAllPassengersQuery());
  }
  @Get('passengers/:id')
  async getPassenger(@Param('id') id: number): Promise<PassengerEntity> {
    return this._queryBus.execute(new GetPassengerQuery(id));
  }
  @Post('passengers')
  async createPassenger(
    @Body() body: CreatePassengerRequestDto,
  ): Promise<PassengerEntity> {
    return this._commandBus.execute(new CreatePassengerCommand(body));
  }
}
