import { SharedModule } from './../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angular2-qrcode';
import { OPBillingRoutingModule } from './opbilling-routing.module';
import { OPBillingComponent } from './opbilling/opbilling.component';
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
    OPBillingComponent
  ],
  imports: [
    CommonModule,
    OPBillingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    QRCodeModule,
    TranslateModule
  ],
})
export class OPBillingModule { }
