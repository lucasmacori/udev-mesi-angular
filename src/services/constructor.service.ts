import { Injectable } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {

  private endpoint: string = "constructor";

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

  public fetchConstructors(): void {
    this.httpClient.get(this.configService.URL + this.endpoint)
      .subscribe(res => {
        this._constructors = res['constructors'];
        this._constructorSub.next(this._constructors);
      }, err => {
        // TODO: Gérer les erreurs
      });
  }
}
