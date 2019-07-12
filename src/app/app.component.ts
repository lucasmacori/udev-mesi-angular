import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public menuOpened: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.menuOpened = false;

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

  toggleSidebar() {
    this.menuOpened = !this.menuOpened;
  }
}
