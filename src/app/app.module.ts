import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClient,HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './common/login/login.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { CompanyComponent } from './contract-management/company/company.component';
import { CompanyConfigurationComponent } from './contract-management/company-configuration/company-configuration.component';
import { PaymentComponent } from './contract-management/payment/payment.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "assets/i18n/", suffix: ".json" },
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    CompanyComponent,
    CompanyConfigurationComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    DatePickerModule,    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
