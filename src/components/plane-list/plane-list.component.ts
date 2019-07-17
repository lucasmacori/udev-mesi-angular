import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plane } from '../../models/plane.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-plane-list',
  templateUrl: './plane-list.component.html',
  styleUrls: ['./plane-list.component.scss']
})
export class PlaneListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() planes: Array<Plane>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['ARN', 'Model', 'IsUnderMaintenance', 'actions'];

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
        this.messages.set('entity_model', messages.get('entity_model'));
        this.messages.set('under_maintenance', messages.get('under_maintenance'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.planes);
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
