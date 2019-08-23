import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Reservation } from '../models/reservation.model';
import { FlightDetail } from '../models/flightDetail.model';

@Injectable()
export class ReservationService {

  private endpoint = 'reservation';

  private _reservationSub: Subject<Array<Reservation>>;
  private _reservations: Array<Reservation>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._reservationSub = new Subject<Array<Reservation>>();
  }

  public get reservationSub(): Subject<Array<Reservation>> {
    return this._reservationSub;
  }

  public fetchReservations(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._reservations = (res['reservations']) ? res['reservations'] : [];
          this._reservations = this.fillNames(this._reservations);
          this._reservationSub.next(this._reservations);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getReservationByARN(id: number): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let reservation: Reservation = (res['reservation']) ? res['reservation'] : undefined;
          if (reservation) {
            reservation = this.fillNames(new Array<Reservation>(reservation))[0];
            resolve(reservation);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getPassengersOfReservation(id: number): Promise<Array<FlightDetail>> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}` + '/flightDetails',
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          const flightDetails: Array<FlightDetail> = (res['flightDetails']) ? res['flightDetails'] : [];
          resolve(flightDetails);
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public saveFlightDetail(reservation: Reservation): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('reservationClass', reservation.reservationClass);
      body.set('flightDetails', reservation.flightDetails.id.toString());
      body.set('passenger', reservation.passenger.id.toString());

      // Appel du web service
      let response: Observable<any>;
      if (reservation.id) {
        body.set('id', reservation.id.toString());
        response = this.httpClient.put(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS });
      } else {
        response = this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err.error['message']);
      });
    });
  }

  public deleteReservation(reservation: Reservation): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (reservation.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${reservation.id}`,
        { headers: this.configService.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err.error['message']);
      });
    });
  }

  private fillNames(reservations: Array<Reservation>): Array<Reservation> {
    for (const reservation of reservations) {
      reservation.flightDetail_name = reservation.flightDetails.flight.departureCity
        + ' - ' + reservation.flightDetails.flight.arrivalCity + ' -> '
        + reservation.flightDetails.departureDateTime + ' - ' + reservation.flightDetails.arrivalDateTime;
      reservation.passenger_name = reservation.passenger.firstName + ' ' + reservation.passenger.lastName;
    }
    return reservations;
  }
}
