import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClient,HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { HeadersInterceptor } from './Interceptor/headers.interceptor';
import { SinglefieldComponent } from './admin/singlefield/singlefield.component';
import { AlertPopupComponent } from './shared/alert-popup/alert-popup.component';
import { AutoSeatchComponent } from './shared/auto-seatch/auto-seatch.component';
import { ModalModule } from "ngx-bootstrap/modal";
import { ReactiveFormsModule } from "@angular/forms";

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
    PaymentComponent,
    SinglefieldComponent,
    AlertPopupComponent,
    AutoSeatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    DatePickerModule,    
    ReactiveFormsModule, 
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
  ],
  providers: [DatePipe, {provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
