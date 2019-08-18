import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plane } from '../../models/plane.model';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { PlaneService } from '../../services/plane.service';
import { DetailExpandAnimation } from '../../animations/detailExpand.animation';
import { FlightDetail } from '../../models/flightDetail.model';

@Component({
  selector: 'app-plane-list',
  templateUrl: './plane-list.component.html',
  styleUrls: ['./plane-list.component.scss'],
  animations: [
    DetailExpandAnimation
  ]
})
export class PlaneListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() planes: Array<Plane>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['ARN', 'model_name', 'isUnderMaintenance'];
  public expandedElement: Plane | null;
  public detailLoading = false;

  constructor(
    private messageService: MessageService,
    private planeService: PlaneService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('ARN', messages.get('ARN'));
        this.messages.set('name', messages.get('name'));
        this.messages.set('model_name', messages.get('entity_model'));
        this.messages.set('isUnderMaintenance', messages.get('under_maintenance'));
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

  fetchDetail(plane: Plane) {
    const editedPlane = this.planes.find((currentPlane: Plane) => {
      return currentPlane.ARN === plane.ARN;
    });

    if (!editedPlane.flightDetails) {
      this.detailLoading = true;
      this.planeService.getFlightDetailOfPlane(plane.ARN)
        .then((flightDetails: Array<FlightDetail>) => {
          // Mise à jour de l'avion, ajout des des détails de vol
          editedPlane.flightDetails = flightDetails;
          this.detailLoading = false;
        })
        .catch((err) => {
          this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        });
    }
  }
}
