import { Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Pipe({
  name: 'identifyClass',
  pure: false
})
export class IdentifyClassPipe implements PipeTransform {

  private messageSub: Subscription;
  private messages: Map<string, string>;

  constructor(
    private messageService: MessageService
  ) {
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('business', messages.get('business'));
        this.messages.set('economic', messages.get('economic'));
      });
    this.messageService.sendMessages();
  }

  transform(value: any, ...args: any[]): any {
    value = value.toUpperCase();
    if (value === 'B') {
      return this.messages.get('business');
    } else if (value === 'E') {
      return this.messages.get('economic');
    }
  }

}
