import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';

const routes: Routes = [
  
  {path:'', component:AppointmentsComponent},
  {
    path:'app-appointments',
    redirectTo:'app-appointments',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }

