import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/message.service';
import { ReportService } from 'src/services/report-results.service';
import { ActivatedRoute } from '@angular/router';
import { Report } from 'src/models/report.model';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  public report: Report;

  public reportFormGroup: FormGroup;

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
        this.messages.set('entity_report', messages.get('entity_report'));
        this.messages.set('choose_a_date', messages.get('choose_a_date'));
      });
    this.messageService.sendMessages();

    // Récupération du code du rapport
    const code = this.route.snapshot.params.code;

    // Récupération du rapport
    this.reportService.getReportByCode(code)
      .then((report: Report) => {
        this.report = report;
        this.initForm();
        this.isLoading = false;
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
    const controls = {};

    // Parcours des paramètres à envoyer pour générer le rapport
    this.report.parameters.forEach((parameter: string) => {
      if (parameter.endsWith('Date')) {
        controls[parameter] = new FormControl(new Date(), [
          Validators.required
        ]);
      }
      // TODO: Ajouter d'autres champs lorsque ce sera nécéssaire
    });

    // Liaison des contrôles au form group
    this.reportFormGroup = new FormGroup(controls);
  }

  generate() {
    // Création de l'association clé-valeur
    const parameters = new Map<string, string>();
    this.report.parameters.forEach((parameter: string) => {
      parameters.set(parameter, this.reportFormGroup.controls[parameter].value);
    });

    this.reportService.executeReport(this.report.code, parameters);
  }
}
