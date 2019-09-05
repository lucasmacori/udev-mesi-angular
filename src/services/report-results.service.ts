import { Injectable } from '@angular/core';
import { ReportResults } from 'src/models/report-results.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Subject } from 'rxjs';
import { Report } from 'src/models/report.model';
import { FormatService } from './format.service';

@Injectable()
export class ReportService {

  private endpoint = 'report';

  private _reportSub = new Subject<Array<Report>>();
  private reports: Array<Report>;

  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
    private formatService: FormatService
  ) {}

  public get reportSub(): Subject<Array<Report>> {
    return this._reportSub;
  }

  public fetchReports(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${this.configService.URL}${this.endpoint}`,
        {  headers: this.configService.HEADERS })
        .subscribe(res => {
          this.reports = (res['reports']) ? res['reports'] : undefined;
          this.reportSub.next(this.reports);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getReportByCode(code: string): Promise<Report> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${this.configService.URL}${this.endpoint}/${code}`,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          if (res['report']) {
            resolve(res['report']);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public executeReport(code: string, parameters: Map<string, any>): Promise<ReportResults> {
    return new Promise((resolve, reject) => {

      // Création de la requête
      const body = new URLSearchParams();
      body.set('code', code);
      parameters.forEach((value: any, parameter: string) => {
        if (parameter.trim().toLowerCase().endsWith('date')) {
          value = this.formatService.dateStringFormat(value);
        }
        body.set(parameter, value);
      });

      // Appel du web service
      this.httpClient.post(`${this.configService.URL}${this.endpoint}`, body.toString(),
        { headers: this.configService.HEADERS })
        .subscribe((res) => {
          resolve((res['results']) ? res['results'] : undefined);
        }, err => {
          reject(err.error['message']);
        });
    });
  }
}
