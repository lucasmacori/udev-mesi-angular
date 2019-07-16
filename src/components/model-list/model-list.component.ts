import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Model } from '../../models/model.model';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() models: Array<Model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['Name', 'Manufacturer', 'CountEcoSlots', 'CountBusinessSlots', 'actions'];

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('name', messages.get('name'));
        this.messages.set('entity_constructor', messages.get('entity_constructor'));
        this.messages.set('countEcoSlots', messages.get('countEcoSlots'));
        this.messages.set('countBusinessSlots', messages.get('countBusinessSlots'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.models);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
