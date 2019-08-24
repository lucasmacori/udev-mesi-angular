import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Passenger } from '../../models/passenger.model';
import { FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-passenger',
  templateUrl: './edit-passenger.component.html',
  styleUrls: ['./edit-passenger.component.scss']
})
export class EditPassengerComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentPassenger: Passenger;

  public passengerFormGroup: FormGroup;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private passengerService: PassengerService,
    private snackBar: MatSnackBar,
    public location: Location
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.validateDeletion = false;

    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messagesSub = this.messageService.messagesSub.subscribe(
      (messages: Map<string, string>) => {
        this.messages = new Map<string, string>();
        this.messages.set('crud_creation', messages.get('crud_creation'));
        this.messages.set('crud_read', messages.get('crud_read'));
        this.messages.set('crud_edition', messages.get('crud_edition'));
        this.messages.set('close', messages.get('close'));
        this.messages.set('firstName', messages.get('firstName'));
        this.messages.set('lastName', messages.get('lastName'));
        this.messages.set('email', messages.get('email'));
        this.messages.set('IDNumber', messages.get('IDNumber'));
        this.messages.set('birthday', messages.get('birthday'));
        this.messages.set('phoneNumber', messages.get('phoneNumber'));
        this.messages.set('password', messages.get('password'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_is_email', messages.get('field_is_email'));
        this.messages.set('field_is_numeric', messages.get('field_is_numeric'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('field_cannot_contain_less_than_4_characters', messages.get('field_cannot_contain_less_than_4_characters'));
        this.messages.set('password_will_not_be_edited', messages.get('password_will_not_be_edited'));
        this.messages.set('passenger_has_been_created', messages.get('passenger_has_been_created'));
        this.messages.set('passenger_has_been_edited', messages.get('passenger_has_been_edited'));
        this.messages.set('passenger_has_been_deleted', messages.get('passenger_has_been_deleted'));
        this.messages.set('choose_a_date', messages.get('choose_a_date'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
        this.messages.set('email_exists', messages.get('email_exists'));
        this.messages.set('phone_number_exists', messages.get('phone_number_exists'));
        this.messages.set('id_number_exists', messages.get('id_number_exists'));
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== '/passenger/new') {
      // Récupération du constructeur
      this.id = this.route.snapshot.params.id;
      this.passengerService.getPassengerById(this.id)
        .then((passenger: Passenger) => {
          this.currentPassenger = passenger;
          this.title = this.currentPassenger.firstName + ' ' + this.currentPassenger.lastName;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        })
        .catch(err => {
          this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        });
    } else {
      this.currentPassenger = new Passenger();
      // Création du formulaire
      this.initForm();

      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  initForm() {
    // Demande d'un mot de passe si création
    const validators = [
      Validators.maxLength(30),
      Validators.minLength(8)
    ];
    if (!this.currentPassenger.id) {
      validators.push(Validators.required);
    }

    this.passengerFormGroup = new FormGroup({
      firstName: new FormControl(this.currentPassenger.firstName, [
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(2)
      ]),
      lastName: new FormControl(this.currentPassenger.lastName, [
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(2)
      ]),
      email: new FormControl(this.currentPassenger.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.minLength(5)
      ]),
      gender: new FormControl(this.currentPassenger.gender, [
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1)
      ]),
      birthday: new FormControl(this.currentPassenger.birthday, [
        Validators.required
      ]),
      phoneNumber: new FormControl(this.currentPassenger.phoneNumber, [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(4),
        Validators.pattern(/^\d+$/)
      ]),
      IDNumber: new FormControl(this.currentPassenger.IDNumber, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(5),
        Validators.pattern(/^\d+$/)
      ]),
      password: new FormControl(undefined, validators),
    });
  }

  hasChanged() {
    let password = this.passengerFormGroup.controls.password.value;
    password = (password && password.trim() !== '') ? password : undefined;
    return (this.passengerFormGroup.controls.firstName.value !== this.currentPassenger.firstName ||
      this.passengerFormGroup.controls.lastName.value !== this.currentPassenger.lastName ||
      this.passengerFormGroup.controls.email.value !== this.currentPassenger.email ||
      this.passengerFormGroup.controls.gender.value !== this.currentPassenger.gender ||
      this.passengerFormGroup.controls.birthday.value !== this.currentPassenger.birthday ||
      this.passengerFormGroup.controls.phoneNumber.value !== this.currentPassenger.phoneNumber ||
      this.passengerFormGroup.controls.IDNumber.value !== this.currentPassenger.IDNumber ||
      password !== undefined);
  }

  checkField(fieldName: string, formControl: FormControl) {
    this.passengerService.checkFieldExists(fieldName, formControl.value)
      .then(exists => {
        if (!exists) {
          formControl.setErrors({ exists: true });
        } else {
          formControl.setErrors({ exists: false });
        }
        formControl.updateValueAndValidity();
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
      });
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    const password = this.passengerFormGroup.controls.password.value;
    this.currentPassenger.firstName = this.passengerFormGroup.controls.firstName.value;
    this.currentPassenger.lastName = this.passengerFormGroup.controls.lastName.value;
    this.currentPassenger.email = this.passengerFormGroup.controls.email.value;
    this.currentPassenger.gender = this.passengerFormGroup.controls.gender.value;
    this.currentPassenger.birthday = this.passengerFormGroup.controls.birthday.value;
    this.currentPassenger.phoneNumber = this.passengerFormGroup.controls.phoneNumber.value;
    this.currentPassenger.IDNumber = this.passengerFormGroup.controls.IDNumber.value;
    this.currentPassenger.password = (password && password.trim() !== '') ? password : undefined;

    const message = (this.currentPassenger.id) ? this.messages.get('passenger_has_been_edited') :
      this.messages.get('passenger_has_been_created');

    // Appel du web service
    this.passengerService.savePassenger(this.currentPassenger)
      .then(() => {
        this.router.navigate(['/passengers', { message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    this.isLoading = true;
    // Récupération des valeurs
    this.passengerService.deletePassenger(this.currentPassenger)
      .then(() => {
        this.router.navigate(['/passengers', { message: this.messages.get('passenger_has_been_deleted') }]);
        this.isLoading = false;
        this.validateDeletion = false;
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
        this.validateDeletion = false;
      });
  }

}
