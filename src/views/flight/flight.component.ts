import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private flightSub: Subscription;
  public flights: Array<Flight>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private flightService: FlightService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_flights', messages.get('menu_flights'));
      this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
    });
    this.messageService.sendMessages();

    // Affichage d'un message si demandé
    this.activatedRoute.params
      .subscribe(params => {
        const message = params.message;
        if (message) {
          this.snackBar.open(message, this.messages.get('close'), { duration: 5000 });
        }
      });

    // Récupération des vols
    this.flightSub = this.flightService.flightSub.subscribe((flights: Array<Flight>) => {
      this.flights = flights;
      this.isLoading = false;
    });
    this.flightService.fetchFlights()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
          this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.flightSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
