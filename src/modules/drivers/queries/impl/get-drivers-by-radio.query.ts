import { IQuery } from '@nestjs/cqrs';
import { LocationQueryDto } from '../../dtos';

export class GetDriversByRadioQuery implements IQuery {
  constructor(public readonly query: LocationQueryDto) {}
}
