import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';

const routes: Routes = [
  
  {path:'', component:PatientRegistrationComponent},
  {
    path:'app-opbilling',
    redirectTo:'app-opbilling',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRegistrationRoutingModule { }
