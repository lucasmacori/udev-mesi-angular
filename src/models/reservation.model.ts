import { FlightDetail } from './flightDetail.model';
import { Passenger } from './passenger.model';

export class Reservation {
  constructor(
    public id?: number,
    public reservationDate?: Date,
    public reservationClass?: string,
    public flightDetails?: FlightDetail,
    public passenger?: Passenger,
    public isActive?: boolean,
    public flightDetail_name?: string,
    public passenger_name?: string
  ) {}
}
