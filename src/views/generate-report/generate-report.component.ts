import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/message.service';
import { ReportService } from 'src/services/report-results.service';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'src/models/report.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  public report: Report;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;

    // Chargement des messages
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('menu_reports', messages.get('menu_reports'));
      });

    // Récupération du code du rapport
    const code = this.route.snapshot.params.code;

    // Récupération du rapport
    this.reportService.getReportByCode(code)
      .then((report: Report) => {
        this.report = report;
        this.initForm();
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'),
          { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

  initForm() {
    // TODO: Générer le formulaire automatiquement à partir des champs nécéssaires pour l'exécution du rapport
  }

  generate() {
    // TODO: Call the report executor web service and get the result in a separate component
  }
}
