import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Reservation } from 'src/models/reservation.model';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ReservationService } from '../../services/reservation.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private reservationSub: Subscription;
  public reservations: Array<Reservation>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_reservations', messages.get('menu_reservations'));
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
    this.reservationSub = this.reservationService.reservationSub.subscribe((reservations: Array<Reservation>) => {
      this.reservations = reservations;
      this.isLoading = false;
    });
    this.reservationService.fetchReservations()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
          this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.reservationSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
