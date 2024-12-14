import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriverCommand } from '../impl';
import { DriverEntity } from '../../entities';
import { LoggerService } from '../../../../infrastructure/logging';

@CommandHandler(CreateDriverCommand)
export class CreateDriverHandler
  implements ICommandHandler<CreateDriverCommand>
{
  constructor(
    @InjectRepository(DriverEntity)
    private readonly _driverRepository: Repository<DriverEntity>,
    private readonly _loggerService: LoggerService,
  ) {}

  async execute(command: CreateDriverCommand): Promise<DriverEntity> {
    this._loggerService.info(`[handler] CreateDriverHandler...`);
    const body = command.body;

    const newDriver = this._driverRepository.create(body);

    await this._driverRepository.save(newDriver);

    this._loggerService.info(`[CreateDriverHandler] Driver created`, newDriver);

    return newDriver;
  }
}
