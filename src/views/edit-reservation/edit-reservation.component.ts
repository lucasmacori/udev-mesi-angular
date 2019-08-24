import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Reservation } from '../../models/reservation.model';
import { FlightDetail } from '../../models/flightDetail.model';
import { Passenger } from '../../models/passenger.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { PassengerService } from '../../services/passenger.service';
import { MatSnackBar } from '@angular/material';
import { Flight } from '../../models/flight.model';
import { Plane } from '../../models/plane.model';
import { Model } from 'src/models/model.model';
import { Constructor } from '../../models/constructor.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss']
})
export class EditReservationComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentReservation: Reservation;

  private flightSub: Subscription;
  public flights: Array<Flight>;

  private passengerSub: Subscription;
  public passengers: Array<Passenger>;

  public reservationFormGroup: FormGroup;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private flightService: FlightService,
    private passengerService: PassengerService,
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
        this.messages.set('entity_reservation', messages.get('entity_reservation'));
        this.messages.set('entity_planning', messages.get('entity_planning'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('reservation_has_been_created', messages.get('reservation_has_been_created'));
        this.messages.set('reservation_has_been_edited', messages.get('reservation_has_been_edited'));
        this.messages.set('reservation_has_been_deleted', messages.get('reservation_has_been_deleted'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
      }
    );
    this.messageService.sendMessages();

    // Récupération des vols
    this.flightSub = this.flightService.flightSub
      .subscribe((flights: Array<Flight>) => {
        this.flights = flights;
      });
    this.flightService.fetchFlights()
      .then(() => {

        // Récupération des détails des vols
        this.flights.forEach((flight: Flight) => {
          this.flightService.getFlightDetailOfFlight(flight.id)
            .then((flightDetails: Array<FlightDetail>) => {
              flight.flightDetails = flightDetails;
            })
            .catch(err => {
              this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'),
                { duration: 5000 });
            });
        });

        // Récupération des passagers
        this.passengerSub = this.passengerService.passengerSub
          .subscribe((passengers: Array<Passenger>) => {
            this.passengers = passengers;
          });
        this.passengerService.fetchPassengers()
          .then(() => {
            if (this.router.url !== '/reservation/new') {
              // Récupération de la réservation
              this.id = this.route.snapshot.params.id;
              this.reservationService.getReservationById(this.id)
                .then((reservation: Reservation) => {
                  this.currentReservation = reservation;
                  this.title = `${this.messages.get('entity_reservation')} N°${reservation.id}`;

                  // Création du formulaire
                  this.initForm();

                  this.isLoading = false;
                })
                .catch(err => {
                  this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'),
                    { duration: 5000 });
                });
            } else {
              this.title = 'Réserver un vol';
              const date = new Date();
              this.currentReservation = new Reservation(undefined, undefined, 'E',
                new FlightDetail(undefined, date, date,
                  new Flight(undefined, undefined, undefined),
                  new Plane(undefined,
                    new Model(undefined, undefined,
                      new Constructor(undefined, undefined),
                      undefined, undefined, undefined
                    )
                  )
                ),
                new Passenger(undefined, undefined, undefined, undefined, undefined, undefined, undefined, date, undefined, undefined)
              );
              // Création du formulaire
              this.initForm();

              this.isLoading = false;
            }
          })
          .catch(err => {
            this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
            this.isLoading = false;
          });
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.flightSub.unsubscribe();
    this.passengerSub.unsubscribe();
  }

  initForm() {
    this.reservationFormGroup = new FormGroup({
      flightDetail: new FormControl(this.currentReservation.flightDetails.id, [
        Validators.required
      ]),
      passenger: new FormControl(this.currentReservation.passenger.id, [
        Validators.required
      ]),
      reservationClass: new FormControl(this.currentReservation.reservationClass, [
        Validators.required
      ])
    });
  }

  hasChanged() {
    return (this.reservationFormGroup.controls.flightDetail.value !== this.currentReservation.flightDetails.id ||
      this.reservationFormGroup.controls.passenger.value !== this.currentReservation.passenger.id ||
      this.reservationFormGroup.controls.reservationClass.value !== this.currentReservation.reservationClass);
  }

  getFlightNameFromFlightDetailId(flightDetailId: number) {
    this.flights.forEach((flight: Flight) => {
      /*flight.flightDetails.forEach((flightDetail: FlightDetail) => {
        if (flightDetail.id === flightDetailId) {
          return flight;
        }
      });*/
      return 'issou';
    });
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentReservation.flightDetails.id = this.reservationFormGroup.controls.flightDetail.value;
    this.currentReservation.passenger.id = this.reservationFormGroup.controls.passenger.value;
    this.currentReservation.reservationClass = this.reservationFormGroup.controls.reservationClass.value;
    const message = (this.currentReservation.id) ? this.messages.get('reservation_has_been_edited')
      : this.messages.get('reservation_has_been_created');

    // Appel du web service
    this.reservationService.saveReservation(this.currentReservation)
      .then(() => {
        this.router.navigate(['/reservations', { message }]);
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
    this.reservationService.deleteReservation(this.currentReservation)
      .then(() => {
        this.router.navigate(['/reservations', { message: this.messages.get('reservation_has_been_deleted') }]);
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
