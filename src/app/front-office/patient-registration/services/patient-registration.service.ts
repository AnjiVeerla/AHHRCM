import { ConfigService } from './../../../services/config/config.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientRegistrationService {
  private patientID = new Subject<Object>();
  public reqToGetPatientData: any;
  private isFetchPatientData = new BehaviorSubject<boolean>(false);
  private FetchPatientData = new BehaviorSubject<boolean>(false);

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + btoa('admin' + ':' + '123456'),
    }),
  };
  
  
  FetchHospitalSpecialisations: any = this.ConfigService.apiUrl + 'FetchHospitalSpecialisations';
  FetchHospitalDoctors: any = this.ConfigService.apiUrl + 'FetchHospitalDoctors';
  CurrentDayDoctorSpecAvailability = this.ConfigService.apiUrl + 'CurrentDayDoctorSpecAvailability';
  FetchDoctorWiseAvailability = this.ConfigService.apiUrl + 'FetchDoctorWiseAvailability';
  FetchHijri = this.ConfigService.apiUrl + 'FetchHijri';
  FetchEnglishDate  = this.ConfigService.apiUrl +'FetchEnglishDate'
  constructor(private ConfigService: ConfigService, private http: HttpClient) { }

  setPatientID(patientId: any) {
    this.reqToGetPatientData = patientId;
    this.patientID.next(patientId);
  }
  getPatientID() {
    return this.patientID.asObservable();
  }

  setIsFetchPatientData(isFetch: boolean) {
    this.isFetchPatientData.next(isFetch);
  }
  getIsFetchPatientData() {
    return this.isFetchPatientData.asObservable();
  }
  setFetchPatientData(isFetch: boolean) {
    this.FetchPatientData.next(isFetch);
  }
  getFetchPatientData() {
    return this.FetchPatientData.asObservable();
  }
  getPatientRegMasterData(data: any) {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'GetPatientRegMasterData',
      data,
      this.httpOptions
    );
  }
  FetchNationalitiesPriority() {
    let data = {
        NationalityID: 0    
    };
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchNationalitiesPriority', data, this.httpOptions);
  }
  savePatientData(data: any, isFetchPatientdata: boolean) {
    let saveAndUpdate = "";
    if (!isFetchPatientdata) {
      saveAndUpdate = 'SavePatientData'
    } else {
      saveAndUpdate = 'UpdatePatientData'
    }
    return this.http.post<any>(
      this.ConfigService.apiUrl + `${saveAndUpdate}`,
      data,
      this.httpOptions
    );
  }

  fetchCityArea(cityArea: any) {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchCityArea',
      cityArea,
      this.httpOptions
    );
  }
  fetchPatientRoot(patientRoot: any) {
    let data = {
      RegCode: patientRoot,
    };
    console.log(data);
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchPatientRoot',
      data,
      this.httpOptions
    );
  }

  fetchPatientData(patientData: any) {
    let data = {
      PatientID: patientData.PatientID,
      RegCode: patientData.RegCode.split('.')[1],
      TBL: '1,5',
      UserId: 0,
      WORKSTATIONID: 0,
      LanguageID: 0,
    };
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchPatientData',
      data,
      this.httpOptions
    );
  }
  fetchPatientModifications(patientData: any, FromDate: any, ToDate: any) {
    let data = {
      PatientID: patientData.PatientID,
      FromDate: FromDate,
      ToDate: ToDate,
    };
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchPatientModificationAudit',
      data,
      this.httpOptions
    );
  }
  fetchAllCities() {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchAllCities',
      {},
      this.httpOptions
    );
  }
  fetchAge(dob: string) {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchAgeCalculate',
      { dob },
      this.httpOptions
    );
  }
  fetchDOBByAge(age: number, ageUomid: number) {
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FetchDOB',
      { age, ageUomid },
      this.httpOptions
    );
  }
  // Doctor Availability 
  // Specialisation http://172.18.17.219/DEVAPI/API/FetchHospitalSpecialisations
  getSpecialisation(reqData: any){
    return this.http.post<any>(this.FetchHospitalSpecialisations,reqData,this.httpOptions);
  }

  // Doctor availability http://172.18.17.219/DEVAPI/API/FetchHospitalDoctors
  getDoctor(reqData: any){
    return this.http.post<any>(this.FetchHospitalDoctors,reqData,this.httpOptions);
  }

  // specialisationwise Data population http://172.18.17.219/DEVAPI/API/CurrentDayDoctorSpecAvailability
  getSpecialisationData(reqData: any){
    return this.http.post<any>(this.CurrentDayDoctorSpecAvailability,reqData,this.httpOptions);
  }  

  // Specialisation and doctor combination Data Selection http://172.18.17.219/DEVAPI/API/FetchDoctorWiseAvailability
  getDoctorData(reqData: any){
    return this.http.post<any>(this.FetchDoctorWiseAvailability,reqData,this.httpOptions);
  }

  fetchCity(country: any){
    let inputData = {
      CountryID: country
    };
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchCityMasters', inputData,this.httpOptions);
  }

  // Hijri Date fetching http://172.18.17.219/DEVAPI/API/FetchHijri
  getHijriDate(reqData: any){
    return this.http.post<any>(this.FetchHijri,reqData,this.httpOptions);
  }

  // English Date fetching http://172.18.17.219/DEVAPI/API/FetchEnglishDate
  getEnglishDate(reqData: any){
    return this.http.post<any>(this.FetchEnglishDate,reqData,this.httpOptions);
  }
  getPatientName2l(name2L: any){
    let inputData = {
      Tbl: '5',
      name: name2L,
      languageID: 0,
    };
    return this.http.post<any>(this.ConfigService.apiUrl + 'PATIENTDICTIONARY',inputData,this.httpOptions);
  }
  upload(file:any) {
      const formData = new FormData(); 
      formData.append("file", file, file.name);
      return this.http.post(this.ConfigService.apiUrl, formData);  
  }
  patientPhotoUpload(formData: any): Observable<any> {
    return this.http.post(this.ConfigService.apiUrl +"FileOperations/" +'FileUpload', formData);
  }
  fileDownload(fileName: any) {
    window.open(this.ConfigService.apiUrl+"FileOperations/" +'FileDownload?fileName='+ fileName, '_blank');
  }
  PhotoUpload(filename: any, file: string) {
    let inputData = {
      Base64: file,
      FileName: filename      
    };
    return this.http.post<any>(
      this.ConfigService.apiUrl + 'FileUpload',
      inputData,
      this.httpOptions
    );
  }
  DownloadProfilePhoto(fileName: string) {
    let input = {
      fileName: fileName,
    };
    return this.http.get<any>(
      this.ConfigService.apiUrl + 'FileDownload?fileName='+fileName,
      this.httpOptions
    );
  }
  FetchAllEmployees(reqData: any){
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchAllEmployees',reqData,this.httpOptions);
  }
  FetchEmployee(reqData: any){
    return this.http.post<any>(this.ConfigService.apiUrl + 'FetchEmployee',reqData,this.httpOptions);
  }
  fetchPatientInfoByYakeenService(iqamaNumber: string, dateOfBirth: any) {
    return this.http.get<any>(this.ConfigService.apiUrl+ '/PatientInfoByYakeenService?iqamaNumber='+ iqamaNumber +'&dateOfBirth='+ dateOfBirth+'', this.httpOptions);
  }
}
