import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Reservation } from '../../models/reservation.model';
import { MessageService } from '../../services/message.service';
import { ReservationService } from '../../services/reservation.service';
import { Subscription } from 'rxjs';
import { DetailExpandAnimation } from '../../animations/detailExpand.animation';
import { Passenger } from '../../models/passenger.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
  animations: [
    DetailExpandAnimation
  ]
})
export class ReservationListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() reservations: Array<Reservation>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['passenger_name', 'flightDetail_name', 'reservationDate'];
  public expandedElement: Reservation | null;
  public detailLoading = false;

  constructor(
    private messageService: MessageService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('reservationDate', messages.get('reservation_date'));
        this.messages.set('reservation_class', messages.get('reservation_class'));
        this.messages.set('flightDetail_name', messages.get('entity_planning'));
        this.messages.set('passenger_name', messages.get('entity_planning'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.reservations);
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
