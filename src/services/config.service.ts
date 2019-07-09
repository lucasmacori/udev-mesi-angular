import { Injectable } from '@angular/core';
import config from './../assets/config.json';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _URL: string;
  public HEADERS: any;

  constructor() {
    // Récupération des valeurs depuis le fichier de configuration
    this._URL = config.url;
    this.HEADERS = new HttpHeaders();
    this.HEADERS = { 'Accept-Language': 'fr', 'Content-Type': 'application/x-www-form-urlencoded' };
  }

  public get URL(): string {
    return this._URL;
  }
}
