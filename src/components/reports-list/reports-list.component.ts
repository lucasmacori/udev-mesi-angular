import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReportResults } from 'src/models/report-results.model';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit, OnDestroy {

  @Input() reports: ReportResults;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('close', messages.get('close'));
      });
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }
}
