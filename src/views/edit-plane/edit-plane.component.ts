import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Model } from '../../models/model.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ModelService } from '../../services/model.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Plane } from '../../models/plane.model';
import { PlaneService } from '../../services/plane.service';
import { Constructor } from '../../models/constructor.model';
import { ConstructorService } from '../../services/constructor.service';

@Component({
  selector: 'app-edit-plane',
  templateUrl: './edit-plane.component.html',
  styleUrls: ['./edit-plane.component.scss']
})
export class EditPlaneComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  public ARN: string;
  public currentPlane: Plane;

  public planeFormGroup: FormGroup;
  public validateDeletion: boolean;

  public manufacturers: Array<Constructor>;
  public manufacturersSub: Subscription;

  public models: Array<Model>;
  public modelsSub: Subscription;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private constructorService: ConstructorService,
    private modelService: ModelService,
    private planeService: PlaneService,
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
        this.messages.set('crud_read', messages.get('crud_read'));
        this.messages.set('crud_edition', messages.get('crud_edition'));
        this.messages.set('close', messages.get('close'));
        this.messages.set('entity_model', messages.get('entity_model'));
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('under_maintenance', messages.get('under_maintenance'));
        this.messages.set('field_cannot_be_edited', messages.get('field_cannot_be_edited'));
        this.messages.set('plane_has_been_created', messages.get('plane_has_been_created'));
        this.messages.set('plane_has_been_edited', messages.get('plane_has_been_edited'));
        this.messages.set('plane_has_been_deleted', messages.get('plane_has_been_deleted'));
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
        // Récupération des modèles
        this.modelsSub = this.modelService.modelSub
        .subscribe((models: Array<Model>) => {
          this.models = models;
          this.affectModelsToManufacturers();
        });
        this.modelService.fetchModels()
          .then(() => {
            if (this.router.url !== '/plane/new') {
              // Récupération du modèle
              this.ARN = this.route.snapshot.params.arn;
              this.planeService.getPlaneByARN(this.ARN)
                .then((plane: Plane) => {
                  this.currentPlane = plane;
                  this.title = this.currentPlane.ARN;

                  // Création du formulaire
                  this.initForm();

                  this.isLoading = false;
                })
                .catch(err => {
                  this.snackBar.open((err.error) ? err.error.message : err.message, this.messages.get('close'), { duration: 5000 });
                });
            } else {
              this.currentPlane = new Plane('',
                new Model(undefined, '', new Constructor(null, undefined, undefined), 0, 0), undefined, undefined);
              // Création du formulaire
              this.initForm();

              this.isLoading = false;
            }
          });
      });
  }

  ngOnDestroy() {
    this.manufacturersSub.unsubscribe();
    this.modelsSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }

  initForm() {
    this.planeFormGroup = new FormGroup({
      ARN: new FormControl(
        {
          value: this.currentPlane.ARN,
          disabled: this.ARN !== undefined
        }, [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2)
        ]
      ),
      model: new FormControl(
        (this.currentPlane.model) ? this.currentPlane.model.id : undefined, [ Validators.required ]
      ),
      isUnderMaintenance: new FormControl(
        {
          value: (this.ARN) ? this.currentPlane.isUnderMaintenance : false,
          disabled: this.ARN === undefined
        }, [ Validators.required ]
      )
    });
  }

  affectModelsToManufacturers() {
    this.manufacturers.forEach((manufacturer: Constructor) => {
      manufacturer.models = new Array<Model>();
      manufacturer.models = this.models.filter((model: Model) => {
        return model.manufacturer.id === manufacturer.id;
      });
    });
  }

  hasChanged() {
    return (this.planeFormGroup.controls.ARN.value !== this.currentPlane.ARN ||
      this.planeFormGroup.controls.model.value !== this.currentPlane.model.id ||
      this.planeFormGroup.controls.isUnderMaintenance.value !== this.currentPlane.isUnderMaintenance);
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentPlane.ARN = this.planeFormGroup.controls.ARN.value;
    this.currentPlane.model = this.models.find(model => {
      return model.id = this.planeFormGroup.controls.model.value;
    });
    this.currentPlane.isUnderMaintenance = this.planeFormGroup.controls.isUnderMaintenance.value;
    const message = (this.ARN) ? this.messages.get('plane_has_been_edited') : this.messages.get('plane_has_been_created');

    // Appel du web service
    let response: Promise<null>;
    if (this.ARN) {
      response = this.planeService.editPlane(this.currentPlane);
    } else {
      response = this.planeService.addPlane(this.currentPlane);
    }

    // Traitement de la réponse
    response
      .then(() => {
        this.router.navigate(['/planes', { message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    this.isLoading = true;
    // Récupération des valeurs
    this.planeService.deletePlane(this.currentPlane)
      .then(() => {
        this.router.navigate(['/planes', { message: this.messages.get('plane_has_been_deleted') }]);
        this.isLoading = false;
        this.validateDeletion = false;
      })
      .catch(err => {
        this.snackBar.open(err, this.messages.get('close'), { duration: 5000 });
        this.isLoading = false;
        this.validateDeletion = false;
      });
  }

}
