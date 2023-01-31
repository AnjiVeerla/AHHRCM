import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  //public devApiUrl = "http://172.18.17.219/DEVAPI/API/";
   public devApiUrl = "https://localhost:44350/API/";
  // public prodApiUrl = "http://172.18.17.219/DEVAPI/API/";
  public apiUrl = this.devApiUrl;

  constructor() { }
}
