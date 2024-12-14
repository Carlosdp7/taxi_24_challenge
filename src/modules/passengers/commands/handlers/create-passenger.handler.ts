import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePassengerCommand } from '../impl';
import { PassengerEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreatePassengerCommand)
export class CreatePassengerHandler
  implements ICommandHandler<CreatePassengerCommand>
{
  constructor(
    @InjectRepository(PassengerEntity)
    private readonly _passengerRepository: Repository<PassengerEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(command: CreatePassengerCommand): Promise<PassengerEntity> {
    this._loggerService.info(`[handler] CreatePassengerHandler...`);
    const name = command.body.name.toUpperCase();

    const exists = await this._passengerRepository.findOne({
      where: {
        name: name,
      },
    });

    if (exists) {
      this._loggerService.error('Passenger already exists', { name });
      throw new BadRequestException('Passenger already exists');
    }

    const newPassenger = this._passengerRepository.create({ name });

    await this._passengerRepository.save(newPassenger);

    this._loggerService.info(
      `[CreatePassengerHandler] Passenger created`,
      newPassenger,
    );

    return newPassenger;
  }
}
