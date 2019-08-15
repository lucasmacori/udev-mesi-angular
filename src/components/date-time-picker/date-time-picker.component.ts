import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';
import { FormControl, ControlValueAccessor, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() disabled = false;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  public date: FormControl;
  public hour: FormControl;
  public minutes: FormControl;

  public registeredOnChange = (date: Date) => {};

  constructor(
    private messageService: MessageService
  ) { }

  ngOnInit() {

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
    this.date = new FormControl({ value: currentDate, disabled: this.disabled });
    this.hour = new FormControl({ value: 12, disabled: this.disabled, Validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(23)
    ] });
    this.minutes = new FormControl({ value: 0, disabled: this.disabled, Validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(59)
    ] });

    this.date.valueChanges.subscribe(this.onChange);
    this.hour.valueChanges.subscribe(this.onChange);
    this.minutes.valueChanges.subscribe(this.onChange);
  }

  get value(): Date {
    const date: Date = this.date.value;
    // date.setHours(this.hour.value);
    // date.setMinutes(this.minutes.value);
    return date;
  }

  onChange(): void {
    //this.registeredOnChange(this.value);
    this.writeValue(this.value);
  }

  writeValue(date: Date): void {
    this.date.setValue(date);
    this.hour.setValue(date.getHours());
    this.minutes.setValue(date.getMinutes());
  }

  registerOnChange(fn: any): void {
    this.registeredOnChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
