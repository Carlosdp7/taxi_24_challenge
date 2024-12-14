import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripCommand } from '../impl';
import { TripEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { DriverEntity } from '../../../drivers/entities';
import { PassengerEntity } from '../../../passengers/entities';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateTripCommand)
export class CreateTripHandler implements ICommandHandler<CreateTripCommand> {
  constructor(
    @InjectRepository(TripEntity)
    private readonly _tripRepository: Repository<TripEntity>,
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    @InjectRepository(PassengerEntity)
    private readonly _passengerRepository: Repository<PassengerEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(command: CreateTripCommand): Promise<TripEntity> {
    this._loggerService.info(`[handler] CreateTripHandler...`);
    const { driverId, passengerId } = command.body;

    const driver = await this._driverRepository.findOne({
      where: {
        id: driverId,
        isAvailable: true,
      },
    });

    if (!driver) {
      this._loggerService.error('[CreateTripHandler] Driver not found');
      throw new NotFoundException('Driver not found');
    }

    const passenger = await this._passengerRepository.findOne({
      where: {
        id: passengerId,
        isAvailable: true,
      },
    });

    if (!passenger) {
      this._loggerService.error('[CreateTripHandler] Passenger not found');
      throw new NotFoundException('Passenger not found');
    }

    driver.isAvailable = false;
    passenger.isAvailable = false;

    const newTrip = this._tripRepository.create({
      ...command.body,
      driverId: driver,
      passengerId: passenger,
    });

    await Promise.all([
      this._tripRepository.save(newTrip),
      this._driverRepository.save(driver),
      this._passengerRepository.save(passenger),
    ]);

    this._loggerService.info(`[CreateTripHandler] Trip created`, newTrip);

    return newTrip;
  }
}
