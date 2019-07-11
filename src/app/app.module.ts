import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatSidenavModule, MatIconModule, MatListModule, MatSelectModule, MatProgressSpinnerModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatChipsModule } from '@angular/material';
import { ConstructorComponent } from './../views/constructor/constructor.component';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';
import { ConstructorListComponent } from './../components/constructor-list/constructor-list.component';
import { EditConstructorComponent } from '../views/edit-constructor/edit-constructor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorService } from 'src/services/constructor.service';
import { ValidateDialogComponent } from './../components/validate-dialog/validate-dialog.component';
import { CreateButtonComponent } from './../components/create-button/create-button.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstructorComponent,
    LanguageSelectorComponent,
    ConstructorListComponent,
    EditConstructorComponent,
    ValidateDialogComponent,
    CreateButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [
    ConstructorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
