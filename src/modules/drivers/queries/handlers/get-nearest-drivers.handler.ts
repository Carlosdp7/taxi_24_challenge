import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNearestDriversQuery } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { getDistance } from 'geolib';

const MAX_NEAREST_DRIVERS = 3;

@QueryHandler(GetNearestDriversQuery)
export class GetNearestDriversHandler
  implements IQueryHandler<GetNearestDriversQuery>
{
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(query: GetNearestDriversQuery): Promise<DriverEntity[]> {
    this._loggerService.info('[handler] GetNearestDriversHandler...');
    const { latitude: startLat, longitude: startLng } = query.query;

    const drivers = await this._driverRepository.find({
      where: {
        isAvailable: true,
      },
    });

    const nearestDrivers: { distance: number; driver: DriverEntity }[] = [];
    for (const driver of drivers) {
      const distance = getDistance(
        { latitude: startLat, longitude: startLng },
        { latitude: driver.latitude, longitude: driver.longitude },
      );

      if (nearestDrivers.length < MAX_NEAREST_DRIVERS) {
        nearestDrivers.push({
          distance: distance,
          driver: driver,
        });

        nearestDrivers.sort((a, b) => b.distance - a.distance);
      } else if (distance < nearestDrivers[0].distance) {
        nearestDrivers[0] = {
          distance,
          driver,
        };

        nearestDrivers.sort((a, b) => b.distance - a.distance);
      }
    }

    return nearestDrivers.map((drivers) => drivers.driver);
  }
}
