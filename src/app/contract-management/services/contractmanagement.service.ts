import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ContractmanagementService {

  
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + btoa('admin' + ':' + '123456'),
    }),
  };
  constructor(private ConfigService: ConfigService, private http: HttpClient) { }

  fetchAllCities() {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchAllCities',
      {},
      this.httpOptions
    );
  }
  getCompanyTypes()
  {
    let data = {
      Type: '122',
      Filter: 'Blocked=0',
      UserID: 0,
      WorkStationId:0,
      LanguageID:1

    };
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchCompanyTypes',
      data,
      this.httpOptions
    );
  }
}
