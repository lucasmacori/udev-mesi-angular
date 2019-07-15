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
        this.messages.set('name', messages.get('name'));
      }
    );
    this.messageService.sendMessages();

    if (this.router.url !== "/constructor/new") {
      // Récupération du constructeur
      this.id = this.route.snapshot.params['id'];
      this.constructorService.getConstructorById(this.id)
        .then((constructor: Constructor) => {
          this.currentConstructor = constructor;
          this.title = this.currentConstructor.name;

          // Création du formulaire
          this.initForm();

          this.isLoading = false;
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
    let message = (this.currentConstructor.id) ? 'Le constructeur à bien été modifié' : 'Le constructeur à bien été créé';

    // Appel du web service
    this.constructorService.saveConstructor(this.currentConstructor)
      .then(() => {
        this.router.navigate(['/constructors', { message: message }]);
        this.isLoading = false;
      })
      .catch(err => {
        this.snackBar.open('Erreur lors la sauvegarde du constructeur. ' + err, 'Fermer', { duration: 5000 });
        this.isLoading = false;
      });
  }

  delete() {
    if (this.validateDeletion) {
      this.isLoading = true;

      // Récupération des valeurs
      this.currentConstructor.name = this.constructorFormControl.value;
      this.constructorService.deleteConstructor(this.currentConstructor)
        .then(() => {
          this.router.navigate(['/constructors', { message: 'Le constructeur à bien été supprimé' }]);
          this.isLoading = false;
          this.validateDeletion = false;
        })
        .catch(err => {
          this.snackBar.open('Erreur lors la suppression du constructeur. ' + err, 'Fermer', { duration: 5000 });
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
