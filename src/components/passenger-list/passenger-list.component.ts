import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { DetailExpandAnimation } from '../../animations/detailExpand.animation';
import { Passenger } from '../../models/passenger.model';
import { PassengerService } from '../../services/passenger.service';

@Component({
  selector: 'app-passenger-list',
  templateUrl: './passenger-list.component.html',
  styleUrls: ['./passenger-list.component.scss'],
  animations: [
    DetailExpandAnimation
  ]
})
export class PassengerListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() passengers: Array<Passenger>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber'];
  public expandedElement: Passenger | null;
  public detailLoading = false;

  constructor(
    private messageService: MessageService,
    private passengerService: PassengerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('firstName', messages.get('firstName'));
        this.messages.set('lastName', messages.get('lastName'));
        this.messages.set('email', messages.get('email'));
        this.messages.set('IDNumber', messages.get('IDNumber'));
        this.messages.set('gender', messages.get('gender'));
        this.messages.set('birthday', messages.get('birthday'));
        this.messages.set('phoneNumber', messages.get('phoneNumber'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.passengers);
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

  fetchDetail(passenger: Passenger) {}
}
