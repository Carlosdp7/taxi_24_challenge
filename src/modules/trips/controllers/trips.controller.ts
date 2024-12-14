import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
import { TripEntity } from '../entities';
import { GetCompletedTripsQuery } from '../queries/impl';
import { CreateTripRequestDto } from '../dtos';
import { CompleteTripCommand, CreateTripCommand } from '../commands/impl';

@Controller()
export class TripsController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}
  @Get('trips/completed')
  async getCompletedTrips(): Promise<TripEntity[]> {
    return this._queryBus.execute(new GetCompletedTripsQuery());
  }

  @Post('trips')
  async createTrip(@Body() body: CreateTripRequestDto): Promise<TripEntity> {
    return this._commandBus.execute(new CreateTripCommand(body));
  }

  @Patch('trips/:id/complete')
  async completeTrip(@Param('id') tripId: number): Promise<TripEntity> {
    return this._commandBus.execute(new CompleteTripCommand(tripId));
  }
}
