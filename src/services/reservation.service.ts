import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Reservation } from '../models/reservation.model';
import { FlightDetail } from '../models/flightDetail.model';
import { AuthService } from './auth.service';

@Injectable()
export class ReservationService {

  private endpoint = 'reservation';
  private HEADERS: any;

  private _reservationSub: Subject<Array<Reservation>>;
  private _reservations: Array<Reservation>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this._reservationSub = new Subject<Array<Reservation>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get reservationSub(): Subject<Array<Reservation>> {
    return this._reservationSub;
  }

  public fetchReservations(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
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

  public getReservationById(id: number): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.HEADERS })
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

  public saveReservation(reservation: Reservation): Promise<null> {
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
        { headers: this.HEADERS });
      } else {
        response = this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.HEADERS });
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
        { headers: this.HEADERS });
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
