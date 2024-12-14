import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersController } from './controllers/passengers.controller';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { PassengerEntity } from './entities';
import { LoggerService } from '../../infrastructure/logging';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PassengerEntity])],
  controllers: [PassengersController],
  providers: [...CommandHandlers, ...QueryHandlers, LoggerService],
})
export class PassengersModule {}
