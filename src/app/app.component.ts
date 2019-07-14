import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public mode: string;
  public menuOpened: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    const defaultMode = (this.configService.isMobile()) ? 'over' : 'side';

    // Récupération du mode depuis le local storage
    const menu_mode: string = localStorage.getItem('menu_mode');
    this.mode = (menu_mode) ? menu_mode : defaultMode;

    // Récupération de l'ouverture du menu depuis le local storage
    const menu_opened: boolean = (localStorage.getItem('menu_opened') === 'true');
    if (menu_opened && this.mode === 'side') {
      this.menuOpened = menu_opened;
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
      }
    );
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
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
}
