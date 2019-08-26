import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatSidenavModule, MatIconModule, MatListModule, MatSelectModule,
  MatProgressSpinnerModule, MatSlideToggleModule, MatInputModule, MatFormFieldModule, MatSnackBarModule,
  MatChipsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatToolbarModule, MatCheckboxModule,
  MatDatepickerModule, MatNativeDateModule, MatRadioModule } from '@angular/material';
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
import { SaveButtonComponent } from '../components/save-button/save-button.component';
import { FlightService } from '../services/flight.service';
import { FlightComponent } from '../views/flight/flight.component';
import { FlightListComponent } from '../components/flight-list/flight-list.component';
import { EditFlightComponent } from '../views/edit-flight/edit-flight.component';
import { FlightDetailService } from '../services/flight-detail.service';
import { FormatService } from '../services/format.service';
import { FlightDetailComponent } from '../views/flight-detail/flight-detail.component';
import { EditFlightDetailComponent } from '../views/edit-flight-detail/edit-flight-detail.component';
import { FlightDetailListComponent } from '../components/flight-detail-list/flight-detail-list.component';
import { DateTimePickerComponent } from '../components/date-time-picker/date-time-picker.component';
import { FirstUpperCaseLetterPipe } from '../pipes/first-upper-case-letter.pipe';
import { EditButtonComponent } from '../components/edit-button/edit-button.component';
import { PassengerComponent } from '../views/passenger/passenger.component';
import { PassengerListComponent } from '../components/passenger-list/passenger-list.component';
import { IdentifyGenderPipe } from '../pipes/identify-gender.pipe';
import { EditPassengerComponent } from '../views/edit-passenger/edit-passenger.component';
import { ReservationComponent } from '../views/reservation/reservation.component';
import { ReservationListComponent } from '../components/reservation-list/reservation-list.component';
import { EditReservationComponent } from '../views/edit-reservation/edit-reservation.component';
import { PassengerService } from '../services/passenger.service';
import { ReservationService } from 'src/services/reservation.service';
import { IdentifyClassPipe } from '../pipes/identify-class.pipe';
import { ThemeService } from 'src/services/theme.service';

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
    PlaneListComponent,
    SaveButtonComponent,
    FlightComponent,
    FlightListComponent,
    EditFlightComponent,
    FlightDetailComponent,
    EditFlightDetailComponent,
    FlightDetailListComponent,
    DateTimePickerComponent,
    FirstUpperCaseLetterPipe,
    EditButtonComponent,
    PassengerComponent,
    PassengerListComponent,
    IdentifyGenderPipe,
    EditPassengerComponent,
    ReservationComponent,
    ReservationListComponent,
    EditReservationComponent,
    IdentifyClassPipe
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatRadioModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    FormatService,
    MessageService,
    ConstructorService,
    ModelService,
    PlaneService,
    FlightService,
    FlightDetailService,
    PassengerService,
    ReservationService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
