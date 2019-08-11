import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { FlightDetail } from '../../models/flightDetail.model';

@Component({
  selector: 'app-flight-detail-list',
  templateUrl: './flight-detail-list.component.html',
  styleUrls: ['./flight-detail-list.component.scss']
})
export class FlightDetailListComponent implements OnInit {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() flightDetails: Array<FlightDetail>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['DepartureDateTime', 'ArrivalDateTime', 'Flight', 'Plane', 'actions'];

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
        this.messages.set('departure_date_time', messages.get('departure_date_time'));
        this.messages.set('arrival_date_time', messages.get('arrival_date_time'));
        this.messages.set('entity_flight', messages.get('entity_flight'));
        this.messages.set('entity_plane', messages.get('entity_plane'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.flightDetails);
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
