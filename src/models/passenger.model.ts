import { Reservation } from './reservation.model';

export class Passenger {
  constructor(
    public id?: number,
    public email?: string,
    public password?: string,
    public hash?: string,
    public firstName?: string,
    public lastName?: string,
    public gender?: string,
    public birthday?: Date,
    public phoneNumber?: string,
    public IDNumber?: string,
    public reservations?: Array<Reservation>
  ) {}
}
