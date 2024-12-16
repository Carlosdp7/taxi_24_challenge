import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DriverEntity } from '../entities';
import {
  GetAllDriversQuery,
  GetAvailableDriversQuery,
  GetDriverQuery,
  GetDriversByRadioQuery,
  GetNearestDriversQuery,
} from '../queries/impl';
import { CreateDriverRequestDto, LocationQueryDto } from '../dtos';
import { CreateDriverCommand } from '../commands/impl';

@Controller()
export class DriversController {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
  ) {}
  @Get('drivers')
  async getAllDrivers(): Promise<DriverEntity[]> {
    return this._queryBus.execute(new GetAllDriversQuery());
  }
  @Get('drivers/availables')
  async getAvailableDrivers(): Promise<DriverEntity[]> {
    return this._queryBus.execute(new GetAvailableDriversQuery());
  }

  @Get('drivers/radio')
  async getDriversByRadio(
    @Query() query: LocationQueryDto,
  ): Promise<DriverEntity[]> {
    return this._queryBus.execute(new GetDriversByRadioQuery(query));
  }
  @Get('drivers/nearest')
  async getNearestDrivers(
    @Query() query: LocationQueryDto,
  ): Promise<DriverEntity[]> {
    return this._queryBus.execute(new GetNearestDriversQuery(query));
  }

  @Get('drivers/:id')
  async getDriver(@Param('id') id: number): Promise<DriverEntity> {
    return this._queryBus.execute(new GetDriverQuery(id));
  }

  @Post('drivers')
  async createDriver(
    @Body() body: CreateDriverRequestDto,
  ): Promise<DriverEntity> {
    return this._commandBus.execute(new CreateDriverCommand(body));
  }
}
