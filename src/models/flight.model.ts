import { FlightDetail } from './flightDetail.model';

export class Flight {
    constructor(
      public id?: number,
      public departureCity?: string,
      public arrivalCity?: string,
      public isActive?: boolean,
      public flightDetails?: Array<FlightDetail>
    ) {}
  }
