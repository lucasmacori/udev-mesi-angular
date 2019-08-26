import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

@Injectable()
export class ThemeService {

  private _themeSub = new Subject<string>();
  private theme: string;

  constructor() {
    // Récupération du thème depuis le local storage
    const theme = localStorage.getItem('theme');
    this.theme = (theme) ? theme : 'light';
  }

  public get themeSub(): Subject<string> {
    return this._themeSub;
  }

  public getTheme(): void {
    this._themeSub.next(this.theme);
  }

  public chooseTheme(theme: string): void {
    if (theme === 'light' || theme === 'dark') {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      this.getTheme();
    }
  }
}
