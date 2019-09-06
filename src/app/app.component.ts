import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { ThemeService } from 'src/services/theme.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isAuth: Promise<boolean>;
  public username: string;

  public mode: string;
  public menuOpened: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private themeSub: Subscription;
  public theme: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private configService: ConfigService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {

    // Récupération de la connexion
    this.loadAuth();
    this.username = this.authService.username;

    // Récupération du theme depuis le service
    this.themeSub = this.themeService.themeSub
      .subscribe((theme: string) => {
        this.theme = theme;
      });
    this.themeService.getTheme();

    const defaultMode = (this.configService.isMobile()) ? 'over' : 'side';

    // Récupération du mode depuis le local storage
    const menuMode: string = localStorage.getItem('menu_mode');
    this.mode = (menuMode) ? menuMode : defaultMode;

    // Récupération de l'ouverture du menu depuis le local storage
    const menuOpened: boolean = (localStorage.getItem('menu_opened') === 'true');
    if (menuOpened && this.mode === 'side') {
      this.menuOpened = menuOpened;
    } else {
      this.menuOpened = (this.mode === 'over') ? false : true;
    }

    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('menu_constructors', messages.get('menu_constructors'));
        this.messages.set('menu_models', messages.get('menu_models'));
        this.messages.set('menu_planes', messages.get('menu_planes'));
        this.messages.set('menu_flights', messages.get('menu_flights'));
        this.messages.set('menu_planning', messages.get('menu_planning'));
        this.messages.set('menu_passengers', messages.get('menu_passengers'));
        this.messages.set('menu_reservations', messages.get('menu_reservations'));
        this.messages.set('menu_reports', messages.get('menu_reports'));
        this.messages.set('menu_logout', messages.get('menu_logout'));
      }
    );
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  loadAuth() {
    this.isAuth = this.authService.loadFromFromLocalStorage();
  }

  toggleSidebar(force: boolean = false, forceClose: boolean = false) {
    if (this.mode === 'over' || force) {
      if (forceClose) {
        this.menuOpened = false;
      } else {
        this.menuOpened = !this.menuOpened;
      }
      if (this.mode === 'side') {
        localStorage.setItem('menu_opened', this.menuOpened.toString());
      }
    }
  }

  toggleMenu() {
    this.mode = (this.mode === 'over') ? 'side' : 'over';
    localStorage.setItem('menu_mode', this.mode);
  }

  toggleTheme() {
    const newTheme = (this.theme === 'light') ? 'dark' : 'light';
    this.themeService.chooseTheme(newTheme);
  }

  logout() {
    this.authService.logout();
    this.loadAuth();
  }
}
