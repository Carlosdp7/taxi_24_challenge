import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './controllers/trips.controller';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { TripEntity } from './entities/trip.entity';
import { LoggerService } from '../../infrastructure/logging';
import { DriverEntity } from '../drivers/entities';
import { PassengerEntity } from '../passengers/entities';
import { InvoiceEntity } from './entities';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      TripEntity,
      DriverEntity,
      PassengerEntity,
      InvoiceEntity,
    ]),
  ],
  controllers: [TripsController],
  providers: [...CommandHandlers, ...QueryHandlers, LoggerService],
})
export class TripsModule {}
