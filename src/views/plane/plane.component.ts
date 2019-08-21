import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Plane } from '../../models/plane.model';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { PlaneService } from '../../services/plane.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-plane',
  templateUrl: './plane.component.html',
  styleUrls: ['./plane.component.scss']
})
export class PlaneComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private planeSub: Subscription;
  public planes: Array<Plane>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private planeService: PlaneService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_planes', messages.get('menu_planes'));
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

    // Récupération des avions
    this.planeSub = this.planeService.planeSub.subscribe((planes: Array<Plane>) => {
      this.planes = planes;
      this.isLoading = false;
    });
    this.planeService.fetchPlanes()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
          this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.planeSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
