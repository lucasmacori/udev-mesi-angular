import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Model } from '../../models/model.model';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { DetailExpandAnimation } from '../../animations/detailExpand.animation';
import { Plane } from '../../models/plane.model';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
  animations: [
    DetailExpandAnimation
  ]
})
export class ModelListComponent implements OnInit, OnDestroy {

  private messagesSub: Subscription;
  public messages: Map<string, string>;
  @Input() models: Array<Model>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public dataSource;
  public displayedColumns: string[] = ['name', 'manufacturer_name', 'countEcoSlots', 'countBusinessSlots'];
  public expandedElement: Model | null;
  public detailLoading = false;

  constructor(
    private messageService: MessageService,
    private modelService: ModelService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('filter', messages.get('filter'));
        this.messages.set('name', messages.get('name'));
        this.messages.set('manufacturer_name', messages.get('entity_constructor'));
        this.messages.set('countEcoSlots', messages.get('countEcoSlots'));
        this.messages.set('countBusinessSlots', messages.get('countBusinessSlots'));
        this.messages.set('menu_planes', messages.get('menu_planes'));
        this.messages.set('no_plane', messages.get('no_plane'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
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

  fetchDetail(model: Model) {
    const editedModel = this.models.find((currentModel: Model) => {
      return currentModel.id === model.id;
    });

    if (!editedModel.planes) {
      this.detailLoading = true;
      this.modelService.getPlanesOfModel(model.id)
        .then((planes: Array<Plane>) => {
          // Mise à jour du modèle, ajout des avions
          editedModel.planes = planes;
          this.detailLoading = false;
        })
        .catch((err) => {
          this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        });
    }
  }
}
