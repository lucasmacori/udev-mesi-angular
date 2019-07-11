import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/services/message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
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
      this.messages.set('menu_models', messages.get('menu_models'));
    });
    this.messageService.sendMessages();
  }

}
