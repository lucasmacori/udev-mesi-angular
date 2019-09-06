import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { reject } from 'q';

@Injectable()
export class AuthService {

  private endpoint = 'auth';

  private _username: string;
  private _token: string;

  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient
  ) {}

  public get username(): string {
    return this._username;
  }

  public get token(): string {
    return this._token;
  }

  public login(username: string, password: string): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('username', username);
      body.set('password', password);

      this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._username = username;
          this._token = res['token'];
          localStorage.setItem('username', this._username);
          localStorage.setItem('token', this._token);
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  public logout(): void {
    this._username = undefined;
    this._token = undefined;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  public checkToken(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this._username && this._token) {

        const body = new URLSearchParams();
        body.set('username', this._username);
        body.set('token', this._token);
  
        this.httpClient.post(this.configService.URL + this.endpoint + '/check', body.toString(),
          { headers: this.configService.HEADERS })
          .subscribe(res => {
            if (res['status'] === 'OK') {
              resolve(true);
            } else {
              resolve(false);
            }
          }, err => {
            reject(err);
          });
      }
      reject();
    });
  }

  public loadFromFromLocalStorage(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this._username && !this._token) {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (username && token) {
          this._username = username;
          this._token = token;
          this.checkToken()
            .then(status => {
              console.log("OK, status: " + status)
              resolve(status);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve(false);
        }
      } else {
        resolve(true);
      }
    }); 
  }
}
