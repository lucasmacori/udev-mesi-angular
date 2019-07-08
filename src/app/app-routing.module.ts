import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructorComponent } from 'src/views/constructor/constructor.component';
import { EditConstructorComponent } from 'src/views/edit-constructor/edit-constructor.component';


const routes: Routes = [
  { path: '', redirectTo: '/constructors', pathMatch: 'full' },
  { path: 'constructors', component: ConstructorComponent },
  { path: 'constructor/:id', component: EditConstructorComponent },
  { path: 'constructor/new', component: EditConstructorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
