import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Flight } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.scss']
})
export class EditFlightComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentFlight: Flight;

  public flightFormGroup: FormGroup;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private snackBar: MatSnackBar,
    public location: Location
  ) { }

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
        this.messages.set('departure_city', messages.get('departure_city'));
        this.messages.set('arrival_city', messages.get('arrival_city'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('flight_has_been_created', messages.get('flight_has_been_created'));
        this.messages.set('flight_has_been_edited', messages.get('flight_has_been_edited'));
        this.messages.set('flight_has_been_deleted', messages.get('flight_has_been_deleted'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
        this.messages.set('create_return', messages.get('create_return'));
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== '/flight/new') {
      // Récupération du vol
      this.id = this.route.snapshot.params.id;
      this.flightService.getFlightById(this.id)
        .then((flight: Flight) => {
          this.currentFlight = flight;
          this.title = this.currentFlight.departureCity + ' - ' + this.currentFlight.arrivalCity;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        })
        .catch(err => {
          this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        });
    } else {
      this.currentFlight = new Flight(undefined, '', '');
      // Création du formulaire
      this.initForm();

      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  initForm() {
    this.flightFormGroup = new FormGroup({
      departureCity: new FormControl(
        this.currentFlight.departureCity, [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2)
        ]
      ),
      arrivalCity: new FormControl(
        this.currentFlight.arrivalCity, [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2)
        ]
      ),
      createReturn: new FormControl(false, [
        Validators.required
      ])
    });
  }

  hasChanged() {
    return (this.flightFormGroup.controls.departureCity.value !== this.currentFlight.departureCity ||
      this.flightFormGroup.controls.arrivalCity.value !== this.currentFlight.arrivalCity);
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentFlight.departureCity = this.flightFormGroup.controls.departureCity.value;
    this.currentFlight.arrivalCity = this.flightFormGroup.controls.arrivalCity.value;
    const message = (this.currentFlight.id) ? this.messages.get('flight_has_been_edited') : this.messages.get('flight_has_been_created');

    // Appel du web service
    this.flightService.saveFlight(this.currentFlight)
      .then(() => {
        if (this.flightFormGroup.controls.createReturn && !this.currentFlight.id) {
          this.currentFlight.departureCity = this.flightFormGroup.controls.arrivalCity.value;
          this.currentFlight.arrivalCity = this.flightFormGroup.controls.departureCity.value;
          this.flightService.saveFlight(this.currentFlight)
            .then(() => {
              this.router.navigate(['/flights', { message }]);
              this.isLoading = false;
            })
            .catch(err => {
              this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
              this.isLoading = false;
            });
        } else {
          this.router.navigate(['/flights', { message }]);
          this.isLoading = false;
        }
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    this.isLoading = true;
    // Récupération des valeurs
    this.flightService.deleteFlight(this.currentFlight)
      .then(() => {
        this.router.navigate(['/flights', { message: this.messages.get('flight_has_been_deleted') }]);
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
