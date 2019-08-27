import { Injectable } from '@angular/core';
import { ReportResults } from 'src/models/report-results.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Subject } from 'rxjs';
import { Report } from 'src/models/report.model';

@Injectable()
export class ReportService {

  private endpoint = 'report';

  private _reportSub = new Subject<Array<Report>>();
  private reports: Array<Report>;

  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient
  ) {}

  public get reportSub(): Subject<Array<Report>> {
    return this._reportSub;
  }

  public fetchReports(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(`${this.configService.URL}${this.endpoint}`,
        {  headers: this.configService.HEADERS })
        .subscribe((res) => {
          this.reports = (res['reports']) ? res['reports'] : undefined;
          this.reportSub.next(this.reports);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public executeReport(code: string, parameters: object): Promise<ReportResults> {
    return new Promise((resolve, reject) => {
      parameters['code'] = code;
      this.httpClient.post(`${this.configService.URL}${this.endpoint}`, parameters,
        {  headers: this.configService.HEADERS })
        .subscribe((res) => {
          resolve((res['results']) ? res['results'] : undefined);
        }, err => {
          reject(err.error['message']);
        });
    });
  }
}