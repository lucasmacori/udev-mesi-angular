import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatSidenavModule, MatIconModule, MatListModule, MatSelectModule, MatProgressSpinnerModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatChipsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatToolbarModule, MatCheckboxModule } from '@angular/material';
import { ConstructorComponent } from './../views/constructor/constructor.component';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';
import { ConstructorListComponent } from './../components/constructor-list/constructor-list.component';
import { EditConstructorComponent } from '../views/edit-constructor/edit-constructor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorService } from 'src/services/constructor.service';
import { ValidateDialogComponent } from './../components/validate-dialog/validate-dialog.component';
import { CreateButtonComponent } from './../components/create-button/create-button.component';
import { ModelComponent } from '../views/model/model.component';
import { ModelService } from 'src/services/model.service';
import { ModelListComponent } from '../components/model-list/model-list.component';
import { EditModelComponent } from '../views/edit-model/edit-model.component';
import { NothingToDoHereComponent } from '../components/nothing-to-do-here/nothing-to-do-here.component';
import { DeleteButtonComponent } from '../components/delete-button/delete-button.component';
import { PlaneComponent } from '../views/plane/plane.component';
import { EditPlaneComponent } from '../views/edit-plane/edit-plane.component';
import { PlaneListComponent } from '../components/plane-list/plane-list.component';
import { PlaneService } from '../services/plane.service';
import { ConfigService } from '../services/config.service';
import { MessageService } from '../services/message.service';

@NgModule({
  declarations: [
    AppComponent,
    ConstructorComponent,
    LanguageSelectorComponent,
    ConstructorListComponent,
    EditConstructorComponent,
    ValidateDialogComponent,
    CreateButtonComponent,
    ModelComponent,
    ModelListComponent,
    EditModelComponent,
    NothingToDoHereComponent,
    DeleteButtonComponent,
    PlaneComponent,
    EditPlaneComponent,
    PlaneListComponent
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
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    MessageService,
    ConstructorService,
    ModelService,
    PlaneService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
