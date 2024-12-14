import { CompleteTripHandler } from './complete-trip.handler';
import { CreateTripHandler } from './create-trip.handler';

export * from './create-trip.handler';
export * from './complete-trip.handler';

export const CommandHandlers = [CreateTripHandler, CompleteTripHandler];
