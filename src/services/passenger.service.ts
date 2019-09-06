import { Injectable } from '@angular/core';
import { Passenger } from 'src/models/passenger.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { FormatService } from './format.service';
import { Reservation } from 'src/models/reservation.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  private endpoint = 'passenger';
  private HEADERS: any;

  private _passengerSub: Subject<Array<Passenger>>;
  private _passengers: Array<Passenger>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private formatService: FormatService
  ) {
    this._passengerSub = new Subject<Array<Passenger>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get passengerSub(): Subject<Array<Passenger>> {
    return this._passengerSub;
  }

  public fetchPassengers(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
        .subscribe(res => {
          this._passengers = (res['passengers']) ? res['passengers'] : [];
          this._passengerSub.next(this._passengers);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getPassengerById(id: number): Promise<Passenger> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          let passenger: Passenger = (res['passenger']) ? res['passenger'] : undefined;
          passenger.birthday = new Date(passenger.birthday);
          if (passenger) {
            resolve(res['passenger']);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getReservationsOfPassenger(id: number): Promise<Array<Reservation>> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}` + '/reservations',
      { headers: this.HEADERS })
        .subscribe(res => {
          const reservations: Array<Reservation> = (res['reservations']) ? res['reservations'] : [];
          resolve(reservations);
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public checkFieldExists(fieldName: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${fieldName}Exists/${value}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          if (res['exists']) {
            resolve(res['exists'] === 'true');
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public savePassenger(passenger: Passenger): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('IDNumber', passenger.IDNumber);
      body.set('birthday', this.formatService.dateStringFormat(passenger.birthday));
      body.set('email', passenger.email);
      body.set('firstName', passenger.firstName);
      body.set('lastName', passenger.lastName);
      body.set('gender', passenger.gender);
      if (passenger.password) {
        body.set('password', passenger.password);
      }
      body.set('phoneNumber', passenger.phoneNumber);

      // Appel du web service
      let response: Observable<any>;
      if (passenger.id) {
        body.set('id', passenger.id.toString())
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
        console.log(err);
        reject(err.error['message']);
      })
    });
  }

  public deletePassenger(passenger: Passenger): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (passenger.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${passenger.id}`,
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
}
