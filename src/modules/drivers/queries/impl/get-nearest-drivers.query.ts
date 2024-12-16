import { IQuery } from '@nestjs/cqrs';
import { LocationQueryDto } from '../../dtos';

export class GetNearestDriversQuery implements IQuery {
  constructor(public readonly query: LocationQueryDto) {}
}
