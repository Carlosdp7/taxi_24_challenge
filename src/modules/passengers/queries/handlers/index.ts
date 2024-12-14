import { GetAllPassengersHandler } from './get-all-passengers.handler';
import { GetPassengerHandler } from './get-passenger.handler';

export * from './get-all-passengers.handler';
export * from './get-passenger.handler';

export const QueryHandlers = [GetAllPassengersHandler, GetPassengerHandler];
