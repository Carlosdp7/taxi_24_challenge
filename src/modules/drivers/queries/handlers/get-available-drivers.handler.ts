import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAvailableDriversQuery } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

@QueryHandler(GetAvailableDriversQuery)
export class GetAvailableDriversHandler
  implements IQueryHandler<GetAvailableDriversQuery>
{
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(): Promise<DriverEntity[]> {
    this._loggerService.info('[handler] GetAvailableDriversHandler...');

    const drivers = await this._driverRepository.find({
      where: {
        isAvailable: true,
      },
    });

    return drivers;
  }
}
