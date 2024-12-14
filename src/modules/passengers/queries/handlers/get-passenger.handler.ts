import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPassengerQuery } from '../impl';
import { PassengerEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetPassengerQuery)
export class GetPassengerHandler implements IQueryHandler<GetPassengerQuery> {
  constructor(
    @InjectRepository(PassengerEntity)
    private readonly _passengerRepository: Repository<PassengerEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(query: GetPassengerQuery): Promise<PassengerEntity> {
    this._loggerService.info('[handler] GetPassengerHandler...');
    const passengerId = query.id;

    const passenger = await this._passengerRepository.findOne({
      where: {
        id: passengerId,
      },
    });

    if (!passenger) {
      this._loggerService.error('[GetPassengerHandler] Passenger not found');
      throw new NotFoundException('Passenger not found');
    }

    return passenger;
  }
}
