import { ICommand } from '@nestjs/cqrs';
import { CreateTripRequestDto } from '../../dtos';

export class CreateTripCommand implements ICommand {
  constructor(public readonly body: CreateTripRequestDto) {}
}
