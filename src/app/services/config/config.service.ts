import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public apiUrl = "https://localhost:44350/API/";

  constructor() { }
}
