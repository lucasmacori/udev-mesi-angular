import { Component, OnInit, Input } from '@angular/core';
import { ReportResults } from 'src/models/report-results.model';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReportService } from 'src/services/report-results.service';

@Component({
  selector: 'app-report-results',
  templateUrl: './report-results.component.html',
  styleUrls: ['./report-results.component.scss']
})
export class ReportResultsComponent implements OnInit {

  @Input() results: ReportResults;

  public datasource;

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit() {}

  isArray() {
    return this.results.results.length > 1 || this.results.results[0]['item'][1].length > 1;
  }

  export() {
    this.reportService.exportToCSV(this.results);
  }
}
