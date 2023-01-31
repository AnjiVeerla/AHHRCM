import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientRegistrationModule } from './front-office/patient-registration/patient-registration.module';
import { LoginComponent } from './common/login/login.component';
import { OPBillingModule } from './front-office/opbilling/opbilling.module';
import { CompanyComponent } from './contract-management/company/company.component';
import { PaymentComponent } from './contract-management/payment/payment.component';

const routes: Routes = [
  {
    path: 'patient-registration',
    loadChildren: () => import('./front-office/patient-registration/patient-registration.module').then(m => m.PatientRegistrationModule)
  }, 
  {
    path: 'opbilling',
    loadChildren: () => import('./front-office/opbilling/opbilling.module').then(m => m.OPBillingModule)
  }, 
  {
    path: 'appointments',
    loadChildren: () => import('./front-office/appointments/appointments-routing.module').then(m => m.AppointmentsRoutingModule)
  },  
  {
    path: 'company',
    component:CompanyComponent
  },  
  {
    path: 'payment',
    component:PaymentComponent
  }, 
  {
    path:'login', 
    component:LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
