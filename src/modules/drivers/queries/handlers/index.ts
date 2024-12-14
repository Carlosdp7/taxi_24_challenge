import { GetAllDriversHandler } from './get-all-drivers.handler';
import { GetAvailableDriversHandler } from './get-available-drivers.handler';
import { GetDriverHandler } from './get-driver.handler';

export * from './get-all-drivers.handler';
export * from './get-available-drivers.handler';
export * from './get-driver.handler';

export const QueryHandlers = [
  GetAllDriversHandler,
  GetAvailableDriversHandler,
  GetDriverHandler,
];
