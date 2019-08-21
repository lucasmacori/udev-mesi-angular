import { Injectable } from '@angular/core';
import { Passenger } from 'src/models/passenger.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { FormatService } from './format.service';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  private endpoint = 'passenger';

  private _passengerSub: Subject<Array<Passenger>>;
  private _passengers: Array<Passenger>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private formatService: FormatService
  ) {
    this._passengerSub = new Subject<Array<Passenger>>();
  }

  public get passengerSub(): Subject<Array<Passenger>> {
    return this._passengerSub;
  }

  public fetchPassengers(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._passengers = (res['passengers']) ? res['passengers'] : [];
          this._passengerSub.next(this._passengers);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getPassengerById(id: number): Promise<Passenger> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let passenger: Passenger = (res['passenger']) ? res['passenger'] : undefined;
          passenger.birthday = new Date(passenger.birthday);
          if (passenger) {
            resolve(res['passenger']);
          } else {
            reject();
          }
        }, err => {
          reject(err);
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
        reject(err['message']);
      })
    });
  }

  public deletePassenger(passenger: Passenger): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (passenger.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${passenger.id}`,
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
        reject(err['message']);
      });
    });
  }
}
