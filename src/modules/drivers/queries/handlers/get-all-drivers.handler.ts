import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllDriversQuery } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

@QueryHandler(GetAllDriversQuery)
export class GetAllDriversHandler implements IQueryHandler<GetAllDriversQuery> {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(): Promise<DriverEntity[]> {
    this._loggerService.info('[handler] GetAllDriversHandler...');

    const drivers = await this._driverRepository.find();

    return drivers;
  }
}
