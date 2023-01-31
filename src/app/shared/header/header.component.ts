import { Patterns } from 'src/global-constants';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';

import { PatientRegistrationService } from '../../front-office/patient-registration/services/patient-registration.service';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { PatientRegistrationComponent } from '../../front-office/patient-registration/patient-registration/patient-registration.component';
import { OPBillingComponent } from '../../front-office/opbilling/opbilling/opbilling.component';
import { DatePipe } from '@angular/common';
import { Subscription, timer } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchForm: any;
  PatientIDRegCode: any = [];
  isFetchPatientdata: boolean = true;
  private stylesMap: Map<any, Node> = new Map();
  private host: Node;
  displayName: string ="";
  displayMultiplePatients:string = "none";
  multiplePatientsList:any;
  subscription?: Subscription;
  date: string ="";
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  lang: string = 'en';
  username: string = '';
  public displayLanguage: string = "English";
  @ViewChild(PatientRegistrationComponent) patientregcomponent:any;
  @ViewChild(OPBillingComponent) opbillingcomponent:any;

  themes = [
    { name: 'English', styleUrls: './assets/styles/style-EN.css' },
    { name: 'Arabic', styleUrls: './assets/styles/style-AR.css' },
];
  constructor(private patientRegService: PatientRegistrationService, public datepipe: DatePipe, public router: Router,
    private translate: TranslateService) { 
    //this.useLanguage(sessionStorage.getItem("language")!); 
    this.host = document.head;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.addStyle(this.themes[0].name, this.themes[0].styleUrls);
    this.addStyle(this.themes[1].name, this.themes[1].styleUrls);
    this.lang = sessionStorage.getItem("language")!;
    this.username = sessionStorage.getItem("username")!;
    this.changeLanguage(this.lang);
    this.searchForm = new FormGroup({
      searchPatient: new FormControl(''),
    });
    // searchPatient: new FormControl('', [
    //   Validators.pattern(Patterns.PAT_MB_NO_OR_NATIONAL_ID_OR_UHID),
    // ]);
    this.patientRegService.getIsFetchPatientData().subscribe((data: any) => {
      if (this.isFetchPatientdata == false) {
        this.searchForm.controls['searchPatient'].setValue("");
      }
    });
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    let currentDateTime =this.datepipe.transform((new Date), 'dd-MMM-yyyy');
    this.date = currentDateTime!;
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }
  onSearchPatient(event: any) {
    if(event.key === "Enter") {
    if (this.searchForm.value.searchPatient.length > 9) {
      if (event.target.value) {
        this.patientRegService.setFetchPatientData(true)
      } else {
        this.patientRegService.setFetchPatientData(false)
      }
      this.patientRegService
        .fetchPatientRoot(event.target.value)
        .subscribe((response) => {
          console.log(response);
          if (response.Status == 'Success' && response.Code == 200) {
            if (response.PatientIDRegCode.length > 1) {
              //Need to populate all the data in modal if patient data is more than 1
              this.displayMultiplePatients = "block";
              this.multiplePatientsList = response.PatientIDRegCode;
            } else {
              this.PatientIDRegCode = response.PatientIDRegCode;
              this.patientRegService.setPatientID(this.PatientIDRegCode[0]);
              console.log(response.PatientIDRegCode);
            }
          } else {
          }
        });
    } else {
      this.patientRegService.setPatientID('');
    }
  }
  }
  clearSearch() {
    this.searchForm.controls['searchPatient'].setValue("");
    this.patientRegService.setIsFetchPatientData(false)    
    this.patientRegService.setIsFetchPatientData(false)
  }
  RedirectToPage(page: any) {
    sessionStorage.setItem("patientID", '');
    sessionStorage.setItem("regCode", '');
    this.router.navigate(['/'+page])
    .then(() => {
      window.location.reload();
    });
  }
  redirectToLoginpage() {
    this.router.navigate(['/login'])
    .then(() => {
      window.location.reload();
    }); 
    //window.location.href="login"    
  }
  changeLanguage(language: string) {
    this.displayLanguage='';   
    var selectedLanguage = sessionStorage.getItem("language")!;   
    if (language == "ar") {
     this.displayLanguage = "Arabic";
     this.removeStyle(this.themes[0].name);
     this.addStyle(this.themes[1].name, this.themes[1].styleUrls);
     sessionStorage.setItem("language","ar");
    }
    else if (language == "en") {
      this.displayLanguage = "English";
      this.removeStyle(this.themes[1].name);
      this.addStyle(this.themes[0].name, this.themes[0].styleUrls);
      sessionStorage.setItem("language","en");
    }
    else {
      this.displayLanguage = "English";
      this.removeStyle(this.themes[1].name);
      this.addStyle(this.themes[0].name, this.themes[0].styleUrls);
      sessionStorage.setItem("language","en");
    }
    this.useLanguage(language);  
  }
  private createStyleNode(content: string): Node {
    const styleEl = document.createElement('link');
    styleEl.rel = 'stylesheet';
    styleEl.href = content;
    return styleEl;
  }
  addStyle(key: any, style: string): void {
    const styleEl = this.createStyleNode(style);
    this.stylesMap.set(key, styleEl);
    this.host.appendChild(styleEl);
}

removeStyle(key: any): void {
    const styleEl = this.stylesMap.get(key);
    if (styleEl) {
        this.stylesMap.delete(key);
        this.host.removeChild(styleEl);
    }
  }
  closeErrorPopup() {
    this.displayMultiplePatients = "none";
  }
  onPatientSelect(patientID:any) {
    this.PatientIDRegCode = patientID;
    this.patientRegService.setPatientID(this.PatientIDRegCode);
    this.displayMultiplePatients = "none";
    this.searchForm.patchValue({
      searchPatient: this.PatientIDRegCode['SSN']
    })
  }
}
