import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Flight } from '../models/flight.model';
import { FlightDetail } from '../models/flightDetail.model';
import { AuthService } from './auth.service';


@Injectable()
export class FlightService {

  private endpoint = 'flight';
  private HEADERS: any;

  private _flightsub: Subject<Array<Flight>>;
  private _flights: Array<Flight>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this._flightsub = new Subject<Array<Flight>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get flightSub(): Subject<Array<Flight>> {
    return this._flightsub;
  }

  public fetchFlights(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
        .subscribe(res => {
          this._flights = (res['flights']) ? res['flights'] : [];
          this._flightsub.next(this._flights);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getFlightById(id: number): Promise<Flight> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          const flight: Flight = (res['flight']) ? res['flight'] : undefined;
          if (flight) {
            resolve(flight);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getFlightDetailOfFlight(id: number): Promise<Array<FlightDetail>> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}` + '/flightDetails',
      { headers: this.HEADERS })
        .subscribe(res => {
          const flightDetails: Array<FlightDetail> = res['flightDetails'];
          resolve(flightDetails);
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public saveFlight(flight: Flight): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('departureCity', flight.departureCity);
      body.set('arrivalCity', flight.arrivalCity);

      // Appel du web service
      let response: Observable<any>;
      if (flight.id) {
        body.set('id', flight.id.toString());
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

  public deleteFlight(flight: Flight): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (flight.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${flight.id}`,
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
