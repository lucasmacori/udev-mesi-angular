import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { FlightDetail } from '../models/flightDetail.model';
import { FormatService } from './format.service';


@Injectable()
export class FlightDetailService {

  private endpoint = 'flightDetails';

  private _flightDetailsub: Subject<Array<FlightDetail>>;
  private _flightDetails: Array<FlightDetail>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private formatService: FormatService
  ) {
    this._flightDetailsub = new Subject<Array<FlightDetail>>();
  }

  public get flightDetailSub(): Subject<Array<FlightDetail>> {
    return this._flightDetailsub;
  }

  public fetchFlightDetails(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._flightDetails = res['flightDetails'];
          this._flightDetailsub.next(this._flightDetails);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getFlightDetailById(id: number): Promise<FlightDetail> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let flightDetail: FlightDetail = res['flightDetails'];
          flightDetail.departureDateTime = this.formatService.stringDateFormat(res['flightDetails'].departureDateTime);
          flightDetail.arrivalDateTime = this.formatService.stringDateFormat(res['flightDetails'].arrivalDateTime);
          resolve(flightDetail);
        }, err => {
          reject(err);
        });
    });
  }

  public saveFlightDetail(flightDetail: FlightDetail): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('departureDateTime', this.formatService.dateStringFormat(flightDetail.departureDateTime));
      body.set('arrivalDateTime', this.formatService.dateStringFormat(flightDetail.arrivalDateTime));
      body.set('flight', flightDetail.flight.id.toString());
      body.set('plane', flightDetail.plane.ARN);

      // Appel du web service
      let response: Observable<any>;
      if (flightDetail.id) {
        body.set('id', flightDetail.id.toString());
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

  public deleteFlightDetail(flightDetail: FlightDetail): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (flightDetail.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${flightDetail.id}`,
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
