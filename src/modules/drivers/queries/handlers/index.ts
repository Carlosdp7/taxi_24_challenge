import { GetAllDriversHandler } from './get-all-drivers.handler';
import { GetAvailableDriversHandler } from './get-available-drivers.handler';
import { GetDriverHandler } from './get-driver.handler';
import { GetNearestDriversHandler } from './get-nearest-drivers.handler';
import { GetDriversByRadioHandler } from './get-drivers-by-radio.handler';

export * from './get-all-drivers.handler';
export * from './get-available-drivers.handler';
export * from './get-driver.handler';
export * from './get-drivers-by-radio.handler';
export * from './get-nearest-drivers.handler';

export const QueryHandlers = [
  GetAllDriversHandler,
  GetAvailableDriversHandler,
  GetDriverHandler,
  GetNearestDriversHandler,
  GetDriversByRadioHandler,
];
