import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { FormControl, ControlValueAccessor, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormatService } from '../../services/format.service';
import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerComponent), multi: true }
  ]
})
export class DateTimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() disabled = false;
  @Input() min: Date;
  @Input() max: Date;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  public date: FormControl;
  public hour: FormControl;
  public minutes: FormControl;

  private onChange: (dateTime: string) => void;

  constructor(
    private messageService: MessageService,
    private formatService: FormatService,
    private adapter: DateAdapter<any>
  ) { }

  ngOnInit() {

    this.adapter.setLocale('fr');
    this.initForm();

    // Chargement des messages
    this.messages = new Map();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('choose_a_date_time', messages.get('choose_a_date_time'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
      });
    this.messageService.sendMessages();
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

  initForm(): void {
    const currentDate = new Date();
    this.date = new FormControl(currentDate);
    this.hour = new FormControl(currentDate.getHours(), [
      Validators.required,
      Validators.min(0),
      Validators.max(23)
    ] );
    this.minutes = new FormControl(currentDate.getMinutes(), [
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ]);
  }

  registerChanges() {
    const date: Date = this.date.value;
    date.setHours(this.hour.value);
    date.setMinutes(this.minutes.value);
    date.setSeconds(0);
    this.onChange(this.formatService.dateStringFormat(date));
  }

  writeValue(dateTime: Date): void {
    if (dateTime) {
      dateTime.setSeconds(0);
      this.date.setValue(dateTime);
      this.hour.setValue(dateTime.getHours());
      this.minutes.setValue(dateTime.getMinutes());
      setTimeout(() => {
        this.registerChanges();
      }, 100)
    }
  }

  registerOnChange(onChange: (dateTime: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched() {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
