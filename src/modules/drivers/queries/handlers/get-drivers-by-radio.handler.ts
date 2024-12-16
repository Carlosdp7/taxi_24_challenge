import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDriversByRadioQuery } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { getDistance } from 'geolib';

const MAX_RADIO = 3000;

@QueryHandler(GetDriversByRadioQuery)
export class GetDriversByRadioHandler
  implements IQueryHandler<GetDriversByRadioQuery>
{
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(query: GetDriversByRadioQuery): Promise<DriverEntity[]> {
    this._loggerService.info('[handler] GetDriversByRadioHandler...');
    const { latitude: startLat, longitude: startLng } = query.query;

    const drivers = await this._driverRepository.find({
      where: {
        isAvailable: true,
      },
    });

    const nearestDrivers = drivers.filter((driver) => {
      const distance = getDistance(
        { latitude: startLat, longitude: startLng },
        { latitude: driver.latitude, longitude: driver.longitude },
      );

      this._loggerService.info(
        `[GetDriversByRadioHandler] Distance: ${distance}`,
      );

      return distance <= MAX_RADIO;
    });

    return nearestDrivers;
  }
}
