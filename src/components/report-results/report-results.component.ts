import { Component, OnInit, Input } from '@angular/core';
import { ReportResults } from 'src/models/report-results.model';
import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-report-results',
  templateUrl: './report-results.component.html',
  styleUrls: ['./report-results.component.scss']
})
export class ReportResultsComponent implements OnInit {

  @Input() results: ReportResults;

  public datasource;

  constructor() { }

  ngOnInit() {}

  isArray() {
    console.log(this.results.results.length > 1 || this.results.results[0]['item'][1].length > 1);
    return this.results.results.length > 1 || this.results.results[0]['item'][1].length > 1;
  }
}
