import { ICommand } from '@nestjs/cqrs';
import { CreatePassengerRequestDto } from '../../dtos';

export class CreatePassengerCommand implements ICommand {
  constructor(public readonly body: CreatePassengerRequestDto) {}
}
