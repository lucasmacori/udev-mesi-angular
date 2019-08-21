import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Passenger } from '../../models/passenger.model';
import { MessageService } from '../../services/message.service';
import { PassengerService } from '../../services/passenger.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss']
})
export class PassengerComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  private passengerSub: Subscription;
  public passengers: Array<Passenger>;

  constructor(
    private messageService: MessageService,
    private passengerService: PassengerService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('menu_passengers', messages.get('menu_passengers'));
      });

    // Affichage d'un message si demandé
    this.activatedRoute.params
      .subscribe(params => {
        const message = params.message;
        if (message) {
          this.snackBar.open(message, this.messages.get('close'), { duration: 5000 });
        }
      });

    // Récupération des passagers
    this.passengerSub = this.passengerService.passengerSub
      .subscribe((passengers: Array<Passenger>) => {
        this.passengers = passengers;
        this.isLoading = false;
      });
    this.passengerService.fetchPassengers();
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
    this.passengerSub.unsubscribe();
  }
}
