import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements OnInit, OnDestroy {

  private messageSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {

    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('crud_edit', messages.get('crud_edit'));
      });
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }
}
