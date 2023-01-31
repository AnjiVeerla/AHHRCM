import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OPBillingComponent } from './opbilling/opbilling.component';

const routes: Routes = [
  
  {path:'', component:OPBillingComponent},
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
export class OPBillingRoutingModule { }
