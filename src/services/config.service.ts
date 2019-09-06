import { Injectable, Injector } from '@angular/core';
import config from './../assets/config.json';
import { AuthService } from './auth.service.js';

@Injectable()
export class ConfigService {

  private _URL: string;
  public _HEADERS: any;

  constructor(
    private injector: Injector
  ) {
    // Récupération des valeurs depuis le fichier de configuration
    this._URL = config.url;
    this._HEADERS = { 'Accept-Language': 'fr', 'Content-Type': 'application/x-www-form-urlencoded' };
  }

  public get URL(): string {
    return this._URL;
  }

  public get HEADERS(): any {
    return this._HEADERS;
  }

  public isMobile(): boolean {
    // Récupération du UserAgent
    const userAgent = navigator.userAgent;

    // Détéction de l'appareil
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
  }
}
