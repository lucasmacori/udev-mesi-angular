import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructorComponent } from 'src/views/constructor/constructor.component';
import { EditConstructorComponent } from 'src/views/edit-constructor/edit-constructor.component';
import { ModelComponent } from 'src/views/model/model.component';
import { EditModelComponent } from 'src/views/edit-model/edit-model.component';
import { PlaneComponent } from 'src/views/plane/plane.component';
import { EditPlaneComponent } from 'src/views/edit-plane/edit-plane.component';
import { FlightComponent } from '../views/flight/flight.component';
import { EditFlightComponent } from '../views/edit-flight/edit-flight.component';


const routes: Routes = [
  { path: '', redirectTo: '/constructors', pathMatch: 'full' },
  { path: 'constructors', component: ConstructorComponent },
  { path: 'constructor/:id', component: EditConstructorComponent },
  { path: 'constructor/new', component: EditConstructorComponent },
  { path: 'models', component: ModelComponent },
  { path: 'model/:id', component: EditModelComponent },
  { path: 'model/new', component: EditModelComponent },
  { path: 'planes', component: PlaneComponent },
  { path: 'plane/:arn', component: EditPlaneComponent },
  { path: 'plane/new', component: EditPlaneComponent },
  { path: 'flights', component: FlightComponent },
  { path: 'flight/:id', component: EditFlightComponent },
  { path: 'flight/new', component: EditFlightComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
