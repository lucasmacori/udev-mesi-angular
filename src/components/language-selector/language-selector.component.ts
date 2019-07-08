import { Component, OnInit, OnChanges } from '@angular/core';
import { MessageService } from 'src/services/message.service';
import { Language } from 'src/models/language.model';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  public selectedLanguage: Language;

  constructor(
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.selectedLanguage = this.messageService.selectedLanguage;
  }

  public onChange($event): void {
    this.messageService.selectedLanguage = $event.value;
    this.selectedLanguage = $event.value;
  }
}
