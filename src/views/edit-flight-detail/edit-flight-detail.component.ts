import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { FlightDetail } from '../../models/flightDetail.model';
import { FlightDetailService } from '../../services/flight-detail.service';
import { Plane } from 'src/models/plane.model';
import { Model } from '../../models/model.model';
import { Constructor } from '../../models/constructor.model';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-edit-flight-detail',
  templateUrl: './edit-flight-detail.component.html',
  styleUrls: ['./edit-flight-detail.component.scss']
})
export class EditFlightDetailComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentFlightDetail: FlightDetail;

  public flightDetailFormGroup: FormGroup;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private flightDetailService: FlightDetailService,
    private snackBar: MatSnackBar
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
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== '/planning/new') {
      // Récupération du détail du vol
      this.id = this.route.snapshot.params.id;
      this.flightDetailService.getFlightDetailById(this.id)
        .then((flightDetail: FlightDetail) => {
          this.currentFlightDetail = flightDetail;
          this.title = this.currentFlightDetail.flight.departureCity + ' - ' + this.currentFlightDetail.flight.arrivalCity
            + ' -> ' + this.currentFlightDetail.departureDateTime + ' - ' + this.currentFlightDetail.arrivalDateTime;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        })
        .catch(err => {
          this.snackBar.open((err.error) ? err.error.message : err.message, this.messages.get('close'), { duration: 5000 });
        });
    } else {
      this.currentFlightDetail = new FlightDetail(undefined, undefined, undefined,
        new Flight(undefined, '', ''),
        new Plane(undefined,
          new Model(undefined, '',
          new Constructor(undefined, ''), 0, 0)
        )
      );
      // Création du formulaire
      this.initForm();

      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  initForm() {
    this.flightDetailFormGroup = new FormGroup({
      departureDateTime: new FormControl(
        this.currentFlightDetail.departureDateTime, [
          Validators.required
        ]
      ),
      arrivalCity: new FormControl(
        this.currentFlightDetail.arrivalDateTime, [
          Validators.required
        ]
      ),
      flight: new FormControl(
        (this.currentFlightDetail.flight) ? this.currentFlightDetail.flight.id : undefined, [
          Validators.required
        ]
      ),
      plane: new FormControl(
        (this.currentFlightDetail.plane) ? this.currentFlightDetail.plane.ARN : undefined, [
          Validators.required
        ]
      )
    });
  }

  hasChanged() {
    return (this.flightDetailFormGroup.controls.departureDateTime.value !== this.currentFlightDetail.departureDateTime ||
      this.flightDetailFormGroup.controls.arrivalDateTime.value !== this.currentFlightDetail.arrivalDateTime ||
      this.flightDetailFormGroup.controls.flight.value !== this.currentFlightDetail.flight.id ||
      this.flightDetailFormGroup.controls.plane.value !== this.currentFlightDetail.plane.ARN);
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentFlightDetail.departureDateTime = this.flightDetailFormGroup.controls.departureDateTime.value;
    this.currentFlightDetail.arrivalDateTime = this.flightDetailFormGroup.controls.arrivalDateTime.value;
    this.currentFlightDetail.flight.id = this.flightDetailFormGroup.controls.flight.value;
    this.currentFlightDetail.plane.ARN = this.flightDetailFormGroup.controls.plane.value;
    const message = (this.currentFlightDetail.id) ? this.messages.get('planning_has_been_edited')
      : this.messages.get('planning_has_been_created');

    // Appel du web service
    this.flightDetailService.saveFlightDetail(this.currentFlightDetail)
      .then(() => {
        this.router.navigate(['/plannings', { message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    this.isLoading = true;
    // Récupération des valeurs
    this.flightDetailService.deleteFlightDetail(this.currentFlightDetail)
      .then(() => {
        this.router.navigate(['/plannings', { message: this.messages.get('planning_has_been_deleted') }]);
        this.isLoading = false;
        this.validateDeletion = false;
      })
      .catch(err => {
        this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
        this.validateDeletion = false;
      });
  }
}
