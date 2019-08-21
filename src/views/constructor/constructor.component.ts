import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';
import { ConstructorService } from 'src/services/constructor.service';
import { Route, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private constructorSub: Subscription;
  public constructors: Array<Constructor>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private constructorService: ConstructorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_constructors', messages.get('menu_constructors'));
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

    // Récupération des constructeurs
    this.constructorSub = this.constructorService.constructorSub.subscribe((constructors: Array<Constructor>) => {
      this.constructors = constructors;
      this.isLoading = false;
    });
    this.constructorService.fetchConstructors()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, 'Fermer', { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.constructorSub.unsubscribe();
  }
}
