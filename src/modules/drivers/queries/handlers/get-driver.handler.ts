import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDriverQuery } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetDriverQuery)
export class GetDriverHandler implements IQueryHandler<GetDriverQuery> {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(query: GetDriverQuery): Promise<DriverEntity> {
    this._loggerService.info('[handler] GetDriverHandler...');
    const driverId = query.id;

    const driver = await this._driverRepository.findOne({
      where: {
        id: driverId,
      },
    });

    if (!driver) {
      this._loggerService.error('[GetDriverHandler] Driver not found');
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }
}
