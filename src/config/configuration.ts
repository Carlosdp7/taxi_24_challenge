import { PassengerEntity } from '../modules/passengers/entities';
import { DriverEntity } from '../modules/drivers/entities/driver.entity';
import { TripEntity } from '../modules/trips/entities';

export default () => ({
  db: {
    entities: [DriverEntity, PassengerEntity, TripEntity],
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
  },
});
