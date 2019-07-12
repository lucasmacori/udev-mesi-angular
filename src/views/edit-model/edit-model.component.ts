import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Model } from '../../models/model.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ModelService } from '../../services/model.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss']
})
export class EditModelComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentModel: Model;

  public modelFormGroup: FormGroup;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
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
        this.messages.set('crud_edition', messages.get('crud_edition'));
        this.messages.set('name', messages.get('name'));
        this.messages.set('menu_constructor', messages.get('menu_constructor'));
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== "/model/new") {
      // Récupération du modèle
      this.id = this.route.snapshot.params['id'];
      this.modelService.getModelById(this.id)
        .then((model: Model) => {
          this.currentModel = model;
          this.title = this.currentModel.name;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        });
    } else {
      this.currentModel = new Model();
      // Création du formulaire
      this.initForm();

      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  initForm() {
    this.modelFormGroup = new FormGroup({
      name: new FormControl(
        this.currentModel.name, [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2)
        ]
      ),
      manufacturer: new FormControl(
        this.currentModel.name, [ Validators.required ]
      )
    });
  }

  hasChanged() {
    return (
      this.modelFormGroup.value['name'] !== this.currentModel.name
      && this.modelFormGroup.value['manufacturer'] !== this.currentModel.manufacturer.id
    );
  }
}
