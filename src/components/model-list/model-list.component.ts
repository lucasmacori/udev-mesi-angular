import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Model } from '../../models/model.model';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  @Input() models: Array<Model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  public dataSource;
  public displayedColumns: string[] = ['Name', 'Manufacturer', 'CountEcoSlots', 'CountBusinessSlots', 'actions'];

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.models);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
