import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompleteTripCommand } from '../impl';
import { TripEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { DriverEntity } from '../../../drivers/entities';
import { PassengerEntity } from '../../../passengers/entities';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CompleteTripCommand)
export class CompleteTripHandler
  implements ICommandHandler<CompleteTripCommand>
{
  constructor(
    @InjectRepository(TripEntity)
    private readonly _tripRepository: Repository<TripEntity>,
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    @InjectRepository(PassengerEntity)
    private readonly _passengerRepository: Repository<PassengerEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(command: CompleteTripCommand): Promise<TripEntity> {
    this._loggerService.info(`[handler] CompleteTripHandler...`);
    const { tripId } = command;

    const trip = await this._tripRepository.findOne({
      relations: ['driverId', 'passengerId'],
      where: {
        id: tripId,
        isCompleted: false,
      },
    });

    if (!trip) {
      this._loggerService.error('[CompleteTripHandler] Trip not found');
      throw new NotFoundException('Trip not found');
    }

    const driver = await this._driverRepository.findOne({
      where: {
        id: trip.driverId.id,
      },
    });

    if (!driver) {
      this._loggerService.error('[CompleteTripHandler] Driver not found');
      throw new NotFoundException('Driver not found');
    }

    const passenger = await this._passengerRepository.findOne({
      where: {
        id: trip.passengerId.id,
      },
    });

    if (!passenger) {
      this._loggerService.error('[CompleteTripHandler] Passenger not found');
      throw new NotFoundException('Passenger not found');
    }

    trip.isCompleted = true;
    driver.isAvailable = true;
    passenger.isAvailable = true;

    await Promise.all([
      this._tripRepository.save(trip),
      this._driverRepository.save(driver),
      this._passengerRepository.save(passenger),
    ]);

    this._loggerService.info(`[CompleteTripHandler] Trip updated`, trip);

    return {
      ...trip,
      driverId: driver,
      passengerId: passenger,
    };
  }
}
