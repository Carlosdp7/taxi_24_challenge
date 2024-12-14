import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversController } from './controllers/drivers.controller';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { DriverEntity } from './entities/driver.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriversController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class DriversModule {}
