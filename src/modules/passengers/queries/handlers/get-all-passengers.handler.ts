import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllPassengersQuery } from '../impl';
import { PassengerEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

@QueryHandler(GetAllPassengersQuery)
export class GetAllPassengersHandler
  implements IQueryHandler<GetAllPassengersQuery>
{
  constructor(
    @InjectRepository(PassengerEntity)
    private readonly _passengerRepository: Repository<PassengerEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(): Promise<PassengerEntity[]> {
    this._loggerService.info('[handler] GetAllPassengersHandler...');

    const passengers = await this._passengerRepository.find();

    return passengers;
  }
}
