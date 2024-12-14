import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DriverEntity } from '../entities';
import {
  GetAllDriversQuery,
  GetAvailableDriversQuery,
  GetDriverQuery,
} from '../queries/impl';
import { CreateDriverRequestDto } from '../dtos';
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
  @Get('drivers/:id')
  async getDriver(@Param('id') id: number): Promise<DriverEntity> {
    return this._queryBus.execute(new GetDriverQuery(id));
  }
  // // Get closest drivers
  // @Get('drivers/nearest')
  // async getNearestDrivers(): Promise<DriverEntity[]> {
  //   return this._queryBus.execute(new GetBannersQuery(customerId));
  // }

  @Post('drivers')
  async createDriver(
    @Body() body: CreateDriverRequestDto,
  ): Promise<DriverEntity> {
    return this._commandBus.execute(new CreateDriverCommand(body));
  }
}
