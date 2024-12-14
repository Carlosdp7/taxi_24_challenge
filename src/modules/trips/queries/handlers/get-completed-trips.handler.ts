import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCompletedTripsQuery } from '../impl';
import { TripEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

@QueryHandler(GetCompletedTripsQuery)
export class GetCompletedTripsHandler
  implements IQueryHandler<GetCompletedTripsQuery>
{
  constructor(
    @InjectRepository(TripEntity)
    private readonly _tripRepository: Repository<TripEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(): Promise<TripEntity[]> {
    this._loggerService.info('[handler] GetCompletedTripsHandler...');

    const tripsCompleted = await this._tripRepository.find({
      where: {
        isCompleted: true,
      },
    });

    return tripsCompleted;
  }
}
