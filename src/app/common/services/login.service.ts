import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private facility = new BehaviorSubject<string>('');
  apiEndpoint = "http://172.18.17.219/rcmapicore/login/";
  constructor(private http: HttpClient) { }


  getUserLocations(userID:number): Observable<any> {
    return this.http.get<any>(this.apiEndpoint + 'GetUserLocations?userID=' + userID).pipe(map(res => res));
  }

  getUserCredential(userName:string,password:string,hospitalId:number,ipAddress:string): Observable<any> {
    return this.http.get<any>(this.apiEndpoint + 'GetUserCredential?userName=' + userName+'&password=' + password+'&locationID=' + hospitalId+'&ipAddress=' + ipAddress).pipe(map(res => res));
  }

//   decrementActiveUser(userID: number,locationID:number,workstationID:number,ipAddress:string): Observable<any> {
//     return this.http.post(this.apiEndpoint + 'DecrementActiveUser?userID=' + userID +'&locationID=' + locationID +'&workstationID=' + workstationID+'&ipAddress=' + ipAddress,'').pipe(map(response => response));
//   }
//   getDefaultCommonHospitalSecurityOptions(locationID:number): Observable<any> {
//     return this.http.get<any>(this.apiEndpoint + 'GetDefaultCommonHospitalSecurityOptions?locationID=' + locationID).pipe(map(res => res));
//   }
//   updateLockUser(userID: number): Observable<any> {
//     return this.http.post(this.apiEndpoint + 'UpdateLockUser?userID=' + userID +'&operatorID=' + 0 +'&routeID=' + 0+'&workstationID=' + 0,'').pipe(map(response => response));
//   }
//   updateUserPwdExpStatus(userID: number): Observable<any> {
//     return this.http.post(this.apiEndpoint + 'UpdateUserPwdExpStatus?userID=' + userID +'&operatorID=' + 0 +'&routeID=' + 0+'&workstationID=' + 0,'').pipe(map(response => response));
//   }
//   getDefaultCommonHospitalConfigurations(locationID:number): Observable<any> {
//     return this.http.get<any>(this.apiEndpoint + 'GetDefaultCommonHospitalConfigurations?locationID=' + locationID).pipe(map(res => res));
//   }



}
