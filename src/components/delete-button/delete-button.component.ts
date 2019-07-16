import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent implements OnInit, OnDestroy {

  @Input() smallButton: boolean;
  @Input() displayed: boolean;
  @Output() validated = new EventEmitter<null>();

  public validateDeletion: boolean;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('delete', messages.get('delete'));
      });
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

  delete() {
    if (this.validateDeletion) {
      this.validated.emit();
    } else {
      this.validateDeletion = true;
      // Annulation de la suppression au bout de 5 secondes sans valider
      setTimeout(() => {
        this.validateDeletion = false;
      }, 5000);
    }
  }

}
