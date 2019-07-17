import { Injectable } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {

  private endpoint = 'manufacturer';

  private _constructorSub: Subject<Array<Constructor>>;
  private _constructors: Array<Constructor>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._constructorSub = new Subject<Array<Constructor>>();
  }

  public get constructorSub(): Subject<Array<Constructor>> {
    return this._constructorSub;
  }

  public fetchConstructors(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._constructors = res['manufacturers'];
          this._constructorSub.next(this._constructors);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getConstructorById(id: number): Promise<Constructor> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          resolve(res['manufacturer']);
        }, err => {
          reject(err);
        });
    });
  }

  public saveConstructor(constructor: Constructor): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('name', constructor.name);

      // Appel du web service
      let response: Observable<any>;
      if (constructor.id) {
        body.set('id', constructor.id.toString())
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

  public deleteConstructor(constructor: Constructor): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (constructor.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${constructor.id}`,
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
}
