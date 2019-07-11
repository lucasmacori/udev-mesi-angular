import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Model } from 'src/models/model.model';

@Injectable()
export class ModelService {

  private endpoint: string = "model";

  private _modelSub: Subject<Array<Model>>;
  private _models: Array<Model>;

  constructor() { }
}
