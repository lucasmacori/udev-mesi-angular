import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() loggedIn = new EventEmitter<undefined>();

  public authFormGroup: FormGroup;

  private messageSub: Subscription;
  public messages: Map<string, string>;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Récupération des messages
    this.messages = new Map<string, string>();
    this.messageSub = this.messageService.messagesSub
      .subscribe((messages: Map<string, string>) => {
        this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
        this.messages.set('menu_login', messages.get('menu_login'));
        this.messages.set('username', messages.get('username'));
        this.messages.set('password', messages.get('password'));
      });
    this.messageService.sendMessages();
      
    this.initForm();
  }

  initForm() {
    this.authFormGroup = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ])
    });
  }

  login() {
    this.authService.login(this.authFormGroup.controls.username.value, this.authFormGroup.controls.password.value)
    .then(() => {
      this.loggedIn.emit();
    })
    .catch(err => {
      this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`, this.messages.get('close'),
        { duration: 5000 });
    });
  }
}
