import { SharedModule } from './../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "assets/i18n/", suffix: ".json" },
  ]);
}

@NgModule({
  declarations: [ AppointmentsComponent ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ],
})
export class AppointmentsModule { }

