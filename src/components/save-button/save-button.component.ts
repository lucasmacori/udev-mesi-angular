import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent {

  @Input() displayed: boolean;
  @Input() disabled: boolean;
  @Input() icon: string;
  @Output() validated = new EventEmitter<null>();

  validate() {
    this.validated.emit();
  }

}
