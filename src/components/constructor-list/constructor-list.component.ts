import { Component, OnInit, Input } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';

@Component({
  selector: 'app-constructor-list',
  templateUrl: './constructor-list.component.html',
  styleUrls: ['./constructor-list.component.scss']
})
export class ConstructorListComponent implements OnInit {

  @Input() constructors: Array<Constructor>;

  constructor() { }

  ngOnInit() {}

}
