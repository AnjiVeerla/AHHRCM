import { SharedModule } from './../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientRegistrationService } from './services/patient-registration.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QRCodeModule } from 'angular2-qrcode';


import { PatientRegistrationRoutingModule } from './patient-registration-routing.module';
import { PatientRegistrationComponent } from './patient-registration/patient-registration.component';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "assets/i18n/", suffix: ".json" },
  ]);
}

@NgModule({
  declarations: [
    PatientRegistrationComponent
  ],
  imports: [
    CommonModule,
    PatientRegistrationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    QRCodeModule,
    TranslateModule
  ],
  // providers: [PatientRegistrationService]
})
export class PatientRegistrationModule { }
