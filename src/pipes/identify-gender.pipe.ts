import { Pipe, PipeTransform, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'identifyGender'
})
export class IdentifyGenderPipe implements PipeTransform {

  private messageSub: Subscription;
  private messages: Map<string, string>;

  constructor(
    private messageService: MessageService
  ) {
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('man', messages.get('man'));
        this.messages.set('woman', messages.get('woman'));
        this.messageSub.unsubscribe();
      });
    this.messageService.sendMessages();
  }

  transform(value: any, ...args: any[]): any {
    value = value.toUpperCase();
    if (value === 'M') {
      return this.messages.get('man');
    } else if (value === 'F') {
      return this.messages.get('woman');
    }
  }
}
