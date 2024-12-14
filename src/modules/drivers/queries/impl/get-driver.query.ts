import { IQuery } from '@nestjs/cqrs';

export class GetDriverQuery implements IQuery {
  constructor(public readonly id: number) {}
}
