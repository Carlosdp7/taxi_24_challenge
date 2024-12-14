import { IQuery } from '@nestjs/cqrs';

export class GetPassengerQuery implements IQuery {
  constructor(public readonly id: number) {}
}
