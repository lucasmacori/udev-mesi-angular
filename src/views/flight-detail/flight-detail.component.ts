import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { FlightDetail } from '../../models/flightDetail.model';
import { FlightDetailService } from '../../services/flight-detail.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.scss']
})
export class FlightDetailComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private flightDetailSub: Subscription;
  public flightDetails: Array<FlightDetail>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private flightDetailService: FlightDetailService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_planning', messages.get('menu_planning'));
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

    // Récupération des détails de vols
    this.flightDetailSub = this.flightDetailService.flightDetailSub.subscribe((flightDetails: Array<FlightDetail>) => {
      this.flightDetails = flightDetails;
      this.isLoading = false;
    });
    this.flightDetailService.fetchFlightDetails()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
          this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.flightDetailSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
