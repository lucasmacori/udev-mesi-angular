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
    private snackBar: MatSnackBar,
    private location: Location
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
        this.messages.set('crud_read', messages.get('crud_read'));
        this.messages.set('crud_edition', messages.get('crud_edition'));
        this.messages.set('close', messages.get('close'));
        this.messages.set('name', messages.get('name'));
        this.messages.set('entity_constructor', messages.get('entity_constructor'));
        this.messages.set('countEcoSlots', messages.get('countEcoSlots'));
        this.messages.set('countBusinessSlots', messages.get('countBusinessSlots'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('model_has_been_created', messages.get('model_has_been_created'));
        this.messages.set('model_has_been_edited', messages.get('model_has_been_edited'));
        this.messages.set('model_has_been_deleted', messages.get('model_has_been_deleted'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
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
        if (this.router.url !== '/model/new') {
          // Récupération du modèle
          this.id = this.route.snapshot.params.id;
          this.modelService.getModelById(this.id)
            .then((model: Model) => {
              this.currentModel = model;
              this.title = this.currentModel.name;

              // Création du formulaire
              this.initForm();

              this.isLoading = false;
            })
            .catch(err => {
              this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
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
    this.manufacturersSub.unsubscribe();
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
      this.modelFormGroup.controls.manufacturer.value !== this.currentModel.manufacturer.id ||
      this.modelFormGroup.controls.countEcoSlots.value !== this.currentModel.countEcoSlots ||
      this.modelFormGroup.controls.countBusinessSlots.value !== this.currentModel.countBusinessSlots);
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
    const message = (this.currentModel.id) ? this.messages.get('model_has_been_edited') : this.messages.get('model_has_been_created');

    // Appel du web service
    this.modelService.saveModel(this.currentModel)
      .then(() => {
        this.router.navigate(['/models', { message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    this.isLoading = true;
    // Récupération des valeurs
    this.modelService.deleteModel(this.currentModel)
      .then(() => {
        this.router.navigate(['/models', { message: this.messages.get('model_has_been_deleted') }]);
        this.isLoading = false;
        this.validateDeletion = false;
      })
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
        this.validateDeletion = false;
      });
  }
}
