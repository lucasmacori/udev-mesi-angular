import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Model } from '../../models/model.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ModelService } from '../../services/model.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Constructor } from '../../models/constructor.model';
import { ConstructorService } from '../../services/constructor.service';

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

  public manufacturers: Array<Constructor>;
  public manufacturersSub: Subscription;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private constructorService: ConstructorService,
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
        this.messages.set('countEcoSlots', messages.get('countEcoSlots'));
        this.messages.set('countBusinessSlots', messages.get('countBusinessSlots'));
      }
    );
    this.messageService.sendMessages();

    // Récupération des constructeurs
    this.manufacturersSub = this.constructorService.constructorSub
      .subscribe((manufacturers: Array<Constructor>) => {
        this.manufacturers = manufacturers;
      });
    this.constructorService.fetchConstructors()
      .then(() => {
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
          this.currentModel = new Model(undefined, '', new Constructor(null, undefined, undefined), 0, 0);
          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        }
      });
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
        (this.currentModel.manufacturer) ? this.currentModel.manufacturer.id : undefined, [ Validators.required ]
      ),
      countEcoSlots: new FormControl(
        this.currentModel.countEcoSlots, [ Validators.required ]
      ),
      countBusinessSlots: new FormControl(
        this.currentModel.countBusinessSlots, [ Validators.required ]
      )
    });
  }

  hasChanged() {
    return (this.modelFormGroup.controls.name.value !== this.currentModel.name ||
      this.modelFormGroup.controls.manufacturer.value !== this.currentModel.manufacturer.id);
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentModel.name = this.modelFormGroup.controls.name.value;
    this.currentModel.manufacturer = this.manufacturers.find(manufacturer => {
      return manufacturer.id = this.modelFormGroup.controls.manufacturer.value;
    });
    this.currentModel.countEcoSlots = this.modelFormGroup.controls.countEcoSlots.value;
    this.currentModel.countBusinessSlots = this.modelFormGroup.controls.countBusinessSlots.value;
    let message = (this.currentModel.id) ? 'Le modèle à bien été modifié' : 'Le modèle à bien été créé';

    // Appel du web service
    this.modelService.saveModel(this.currentModel)
      .then(() => {
        this.router.navigate(['/models', { message: message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open('Erreur lors la sauvegarde du modèle. ' + err, 'Fermer', { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    if (this.validateDeletion) {
      this.isLoading = true;

      // Récupération des valeurs
      this.modelService.deleteModel(this.currentModel)
        .then(() => {
          this.router.navigate(['/models', { message: 'Le modèle à bien été supprimé' }]);
          this.isLoading = false;
          this.validateDeletion = false;
        })
        .catch(err => {
          this.snackBar.open('Erreur lors la suppression du modèle. ' + err, 'Fermer', { duration: 5000 });
          this.isLoading = false;
          this.validateDeletion = false;
        });
    } else {
      this.validateDeletion = true;
      // Annulation de la suppression au bout de 5 secondes sans valider
      setTimeout(() => {
        this.validateDeletion = false;
      }, 5000);
    }
  }
}
