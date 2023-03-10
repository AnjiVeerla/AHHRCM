import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';
import { CompaniesList, IcompanyInfo } from 'src/app/shared/Models/companies-list';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractmanagementService {
  getFilterData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    public ConfigService: ConfigService,
    public http: HttpClient) { }

  fetchAllCities() {
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchAllCities', {});
  }

  getListData(): Observable<any> {
    return this.getFilterData;
  }

  getCompanyTypes() {
    let data = {
      Type: '122',
      Filter: 'Blocked=0',
      UserID: 0,
      WorkStationId: 0,
      LanguageID: 1

    };
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchCompanyTypes', data);
  }

  getCompaniesList(data: string) {
    return this.http.get<CompaniesList[]>(this.ConfigService.apiUrl + `sscompanies?value=${data}`);
  }

  getSingleCompanyData(id: number) {
    return this.http.get<IcompanyInfo>(this.ConfigService.apiUrl + `getcompany?id=${id}`);
  }


}
