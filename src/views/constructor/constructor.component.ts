import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';
import { ConstructorService } from 'src/services/constructor.service';
import { Route, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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

    // Affichage d'un message si demandé
    this.activatedRoute.params
      .subscribe(params => {
        const message = params['message']
        if (message) this.snackBar.open(message, 'Fermer', { duration: 5000 });
      });

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('menu_constructors', messages.get('menu_constructors'));
    });
    this.messageService.sendMessages();

    // Récupération des constructeurs
    this.constructorSub = this.constructorService.constructorSub.subscribe((constructors: Array<Constructor>) => {
      this.constructors = constructors;
      this.isLoading = false;
    });
    this.constructorService.fetchConstructors();
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.constructorSub.unsubscribe();
  }
}
