import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { Flight } from '../../models/flight.model';
import { DetailExpandAnimation } from '../../animations/detailExpand.animation';
import { FlightService } from '../../services/flight.service';
import { FlightDetail } from '../../models/flightDetail.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss'],
  animations: [
    DetailExpandAnimation
  ]
})
export class FlightListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() flights: Array<Flight>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['departureCity', 'arrivalCity', 'actions'];
  public expandedElement: Flight | null;
  public detailLoading = false;

  constructor(
    private messageService: MessageService,
    private flightService: FlightService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('departureCity', messages.get('departure_city'));
        this.messages.set('arrivalCity', messages.get('arrival_city'));
      }
    );
    this.messageService.sendMessages();

    this.dataSource = new MatTableDataSource(this.flights);
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

  fetchDetail(flight: Flight) {
    const editedFlight = this.flights.find((currentFlight: Flight) => {
      return currentFlight.id === flight.id;
    });

    if (!editedFlight.flightDetails) {
      this.detailLoading = true;
      this.flightService.getFlightDetailOfFlight(flight.id)
        .then((flightDetails: Array<FlightDetail>) => {
          // Mise à jour du vol, ajout des des détails de vol
          editedFlight.flightDetails = flightDetails;
          this.detailLoading = false;
        })
        .catch((err) => {
          this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        });
    }
  }
}
