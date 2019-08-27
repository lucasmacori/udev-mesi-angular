import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/message.service';
import { Report } from 'src/models/report.model';
import { ReportService } from 'src/services/report-results.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  private reportSub: Subscription;
  public reports: Array<Report>;

  constructor(
    private messageService: MessageService,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {

    this.isLoading = true;

    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('close', messages.get('close'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
        this.messages.set('menu_reports', messages.get('menu_reports'));
      });
    this.messageService.sendMessages();

    // Récupération des rapports
    this.reportSub = this.reportService.reportSub
      .subscribe((reports: Array<Report>) => {
        this.reports = reports;
      });
    this.reportService.fetchReports()
      .then(() => {
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
        this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
    this.reportSub.unsubscribe();
  }
}
