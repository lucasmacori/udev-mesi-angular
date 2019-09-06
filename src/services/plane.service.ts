import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Plane } from '../models/plane.model';
import { FlightDetail } from '../models/flightDetail.model';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';

@Injectable()
export class PlaneService {

  private endpoint = 'plane';
  private HEADERS: any;

  private _planeSub: Subject<Array<Plane>>;
  private _planes: Array<Plane>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this._planeSub = new Subject<Array<Plane>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get planeSub(): Subject<Array<Plane>> {
    return this._planeSub;
  }

  public fetchPlanes(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
        .subscribe(res => {
          this._planes = (res['planes']) ? res['planes'] : [];
          this._planes = this.fillModelName(this._planes);
          this._planeSub.next(this._planes);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getPlaneByARN(ARN: string): Promise<Plane> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${ARN}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          let plane: Plane = (res['plane']) ? res['plane'] : undefined;
          if (plane) {
            plane = this.fillModelName(new Array<Plane>(plane))[0];
            plane.isUnderMaintenance = res['plane'].isUnderMaintenance === 'true';
            resolve(plane);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getFlightDetailOfPlane(ARN: string): Promise<Array<FlightDetail>> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${ARN}` + '/flightDetails',
      { headers: this.HEADERS })
        .subscribe(res => {
          const flightDetails: Array<FlightDetail> = (res['flightDetails']) ? res['flightDetails'] : [];
          resolve(flightDetails);
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public addPlane(plane: Plane): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('ARN', plane.ARN);
      body.set('model', plane.model.id.toString());

      // Appel du web service
      let response: Observable<any>;
      response = this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.HEADERS });

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

  public editPlane(plane: Plane): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('ARN', plane.ARN);
      body.set('model', plane.model.id.toString());
      body.set('isUnderMaintenance', plane.isUnderMaintenance.toString());

      // Appel du web service
      let response: Observable<any>;
      response = this.httpClient.put(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.HEADERS });

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

  public deletePlane(plane: Plane): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (plane.ARN) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${plane.ARN}`,
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

  private fillModelName(planes: Array<Plane>): Array<Plane> {
    for (const plane of planes) {
      plane.model_name = plane.model.name;
    }
    return planes;
  }
}
