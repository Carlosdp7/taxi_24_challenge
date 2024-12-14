import { ICommand } from '@nestjs/cqrs';

export class CompleteTripCommand implements ICommand {
  constructor(public readonly tripId: number) {}
}
