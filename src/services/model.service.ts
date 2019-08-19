import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Model } from 'src/models/model.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Plane } from '../models/plane.model';

@Injectable()
export class ModelService {

  private endpoint = 'model';

  private _modelSub: Subject<Array<Model>>;
  private _models: Array<Model>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._modelSub = new Subject<Array<Model>>();
  }

  public get modelSub(): Subject<Array<Model>> {
    return this._modelSub;
  }

  public fetchModels(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._models = (res['models']) ? res['models'] : [];
          this._models = this.fillManufacturerName(this._models);
          this._modelSub.next(this._models);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public getModelById(id: number): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          let model: Model = (res['model']) ? res['model'] : undefined;
          if (model) {
            model = this.fillManufacturerName(new Array<Model>(model))[0];
            resolve(model);
          } else {
            reject();
          }
        }, err => {
          reject(err);
        });
    });
  }

  public getPlanesOfModel(id: number): Promise<Array<Plane>> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}` + '/planes',
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          const planes: Array<Plane> = (res['planes']) ? res['planes'] : [];
          resolve(planes);
        }, err => {
          reject(err);
        });
    });
  }

  public saveModel(model: Model): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('name', model.name);
      body.set('manufacturer', model.manufacturer.id.toString());
      body.set('countEcoSlots', model.countEcoSlots.toString());
      body.set('countBusinessSlots', model.countBusinessSlots.toString());

      // Appel du web service
      let response: Observable<any>;
      if (model.id) {
        body.set('id', model.id.toString());
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

  public deleteModel(model: Model): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (model.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${model.id}`,
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

  private fillManufacturerName(models: Array<Model>): Array<Model> {
    for (const model of models) {
      model.manufacturer_name = model.manufacturer.name;
    }
    return models;
  }
}
