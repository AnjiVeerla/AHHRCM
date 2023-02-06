import { Injectable } from '@angular/core';
import { ConfigService } from './../../../services/config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpbillingService {

  constructor(private ConfigService: ConfigService, private http: HttpClient) {

  }
  fetchPatientData(patientData: any) {
    let data = {
      PatientID: patientData,
      RegCode: '',
      TBL: '1,5',
      UserId: 0,
      WORKSTATIONID: 0,
      LanguageID: 0,
    };
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchPatientData', data);
  }
  getAllServices() {
    let data = {
      type: "2"
    }
    return this.http.post<any>(this.ConfigService.apiUrl + 'HospitalServices', data);
  }
  fetchConsultants(serviceID: any, serviceType: any) {
    let data = {
      //ServiceID : serviceID,
      name: serviceType
    }
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchConsultants', data);
  }
  validateRegCode(regCode: any) {
    let data = {
      UHID: regCode,
      HospitalId: 3,
      UserID: 4393,
      WorkStationID: 3392
    }
    return this.http.post<any>(this.ConfigService.apiUrl + 'ValidationRegCode',data);
  }
  FetchServicePrice(serviceId: any, serviceTypeId: any, TariffId: any, VisitType: any, SpecialisationId: any, bedType: any) {
    let data = {
      ServiceId: serviceId,
      serviceTypeId: serviceTypeId,
      TariffId: TariffId,
      VisitType: VisitType,
      SpecialisationId: SpecialisationId,
      BedTypeID: bedType,
      UserID: 4393,
      WorkStationID: 3392
    }
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchServicePrice', data);
  }
  getPayment(outPatientBill: any): Observable<any> {
    var billingApiEndpoint = `http://172.18.17.219/rcmapicore/` + "OutPatientBillingCashCredit/";
    return this.http
      .post(billingApiEndpoint + `Payment`, outPatientBill);
  }
  saveBill(saveBill: any): Observable<any> {
    var billingApiEndpoint = `http://172.18.17.219/rcmapicore/` + "OutPatientBillingCashCredit/";
    return this.http
      .post(billingApiEndpoint + `SaveBill`, saveBill)
  }
}
