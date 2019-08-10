import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Plane } from '../models/plane.model';

@Injectable()
export class PlaneService {

  private endpoint = 'plane';

  private _planeSub: Subject<Array<Plane>>;
  private _planes: Array<Plane>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._planeSub = new Subject<Array<Plane>>();
  }

  public get planeSub(): Subject<Array<Plane>> {
    return this._planeSub;
  }

  public fetchPlanes(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._planes = res['planes'];
          this._planeSub.next(this._planes);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getPlaneByARN(ARN: string): Promise<Plane> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${ARN}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let plane: Plane = res['plane'];
          plane.isUnderMaintenance = res['plane'].isUnderMaintenance === 'true';
          resolve(plane);
        }, err => {
          reject(err);
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
        { headers: this.configService.HEADERS });

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

  public editPlane(plane: Plane): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('ARN', plane.ARN);
      body.set('model', plane.model.id.toString());
      body.set('isUnderMaintenance', plane.isUnderMaintenance.toString());

      // Appel du web service
      let response: Observable<any>;
      response = this.httpClient.put(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS });

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

  public deletePlane(plane: Plane): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (plane.ARN) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${plane.ARN}`,
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
