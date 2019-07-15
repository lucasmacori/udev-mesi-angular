import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nothing-to-do-here',
  templateUrl: './nothing-to-do-here.component.html',
  styleUrls: ['./nothing-to-do-here.component.scss']
})
export class NothingToDoHereComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public text: string;

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Récupération du message dans la langue choisie
    this.messagesSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.text = messages.get('nothing_to_do_here');
      });
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }
}
