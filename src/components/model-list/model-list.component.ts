import { Component, OnInit, Input } from '@angular/core';
import { Model } from '../../models/model.model';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  @Input() models: Array<Model>;
  public displayedColumns: string[] = ['Nom', 'Constructeur', 'actions'];

  constructor() { }

  ngOnInit() {
  }

}
