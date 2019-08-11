import { Flight } from './flight.model';
import { Plane } from './plane.model';

export class FlightDetail {
    constructor(
      public id?: number,
      public departureDateTime?: Date,
      public arrivalDateTime?: Date,
      public flight?: Flight,
      public plane?: Plane,
      public isActive?: boolean
    ) {}
  }
