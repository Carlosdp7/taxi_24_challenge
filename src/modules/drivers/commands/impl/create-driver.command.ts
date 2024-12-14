import { ICommand } from '@nestjs/cqrs';
import { CreateDriverRequestDto } from '../../dtos';

export class CreateDriverCommand implements ICommand {
  constructor(public readonly body: CreateDriverRequestDto) {}
}
