import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructorService } from 'src/services/constructor.service';
import { Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-constructor',
  templateUrl: './edit-constructor.component.html',
  styleUrls: ['./edit-constructor.component.scss']
})
export class EditConstructorComponent implements OnInit, OnDestroy {

  public title: string;
  private messagesSub: Subscription;
  public messages: Map<string, string>;
  public isLoading: boolean;

  private id: number;
  public currentConstructor: Constructor;

  public constructorFormControl: FormControl;
  public validateDeletion: boolean;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private constructorService: ConstructorService,
    private snackBar: MatSnackBar
  ) {}

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
        this.messages.set('field_is_required', messages.get('field_is_required'));
        this.messages.set('field_cannot_contain_less_than_2_characters', messages.get('field_cannot_contain_less_than_2_characters'));
        this.messages.set('constructor_has_been_created', messages.get('constructor_has_been_created'));
        this.messages.set('constructor_has_been_edited', messages.get('constructor_has_been_edited'));
        this.messages.set('constructor_has_been_deleted', messages.get('constructor_has_been_deleted'));
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== '/constructor/new') {
      // Récupération du constructeur
      this.id = this.route.snapshot.params.id;
      this.constructorService.getConstructorById(this.id)
        .then((constructor: Constructor) => {
          this.currentConstructor = constructor;
          this.title = this.currentConstructor.name;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
        })
        .catch(err => {
          this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'), { duration: 5000 });
        });
    } else {
      this.currentConstructor = new Constructor();
      // Création du formulaire
      this.initForm();

      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
  }

  initForm() {
    this.constructorFormControl = new FormControl(this.currentConstructor.name, [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(2)
    ]);
  }

  hasChanged() {
    return this.constructorFormControl.value !== this.currentConstructor.name;
  }

  save() {
    this.isLoading = true;

    // Récupération des valeurs
    this.currentConstructor.name = this.constructorFormControl.value;
    const message = (this.currentConstructor.id) ? this.messages.get('constructor_has_been_edited') :
    this.messages.get('constructor_has_been_created');

    // Appel du web service
    this.constructorService.saveConstructor(this.currentConstructor)
      .then(() => {
        this.router.navigate(['/constructors', { message }]);
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
    this.currentConstructor.name = this.constructorFormControl.value;
    this.constructorService.deleteConstructor(this.currentConstructor)
      .then(() => {
        this.router.navigate(['/constructors', { message: this.messages.get('constructor_has_been_deleted') }]);
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
