import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { popAnimation } from 'src/animations/pop.animation';

@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.scss'],
  animations: []
})
export class CreateButtonComponent implements OnInit {

  @Input() icon: string;
  public shouldToggle = false;

  constructor() { }

  ngOnInit() {
  }

}
