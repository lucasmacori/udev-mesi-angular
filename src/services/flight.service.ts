import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Flight } from '../models/flight.model';


@Injectable()
export class FlightService {

  private endpoint = 'flight';

  private _flightsub: Subject<Array<Flight>>;
  private _flights: Array<Flight>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._flightsub = new Subject<Array<Flight>>();
  }

  public get flightSub(): Subject<Array<Flight>> {
    return this._flightsub;
  }

  public fetchFlights(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._flights = res['flights'];
          this._flightsub.next(this._flights);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getFlightById(id: number): Promise<Flight> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let flight: Flight = res['flight'];
          resolve(flight);
        }, err => {
          reject(err);
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
      });
    });
  }

  public deleteFlight(flight: Flight): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (flight.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${flight.id}`,
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
