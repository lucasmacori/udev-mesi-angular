import { Injectable } from '@angular/core';
import config from './../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _URL: string;

  constructor() {
    // Récupération des valeurs depuis le fichier de configuration
    this._URL = config.url;
  }

  public get URL(): string {
    return this._URL;
  }
}
