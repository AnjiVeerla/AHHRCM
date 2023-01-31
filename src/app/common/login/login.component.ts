import { Component, OnInit, HostBinding } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from '@angular/common';
import { Subscription, timer } from "rxjs";
import { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from "../services/login.service";
import { EncryptService } from "./../../shared/services/encrypt.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private stylesMap: Map<any, Node> = new Map();
  private host: Node;
  displayName: string ="";
  date: string ="";
  public displayLanguage: string = "English";
  btnEnlang: string = "btn selected";
  btnArlang: string = "btn";
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription?: Subscription;
  loginForm!: FormGroup;
  isFormSubmitted: boolean = false;
  loader: boolean = false;
  errormsg?: string;
  userCredential: any;
  userlocations: any;
  loginAttemptCount?: number;
  iserror: boolean = false;
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      location: ['', Validators.required],
    });  
  }
  themes = [
    { name: 'English', styleUrls: './assets/styles/style-EN.css' },
    { name: 'Arabic', styleUrls: './assets/styles/style-AR.css' },
];

  constructor(private translate: TranslateService, public datepipe: DatePipe, private router: Router, 
    private loginService: LoginService, private encryptService: EncryptService, private formBuilder: FormBuilder) { 
    this.useLanguage("en");
    this.host = document.head;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {    
    this.addStyle(this.themes[0].name, this.themes[0].styleUrls);
    this.addStyle(this.themes[1].name, this.themes[1].styleUrls);
    this.changeLanguage('en');
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
    let currentDateTime =this.datepipe.transform((new Date), 'dd-MMM-yyyy');
    this.date = currentDateTime!;
    this.initializeForm();
    this.getuserLocations();
  }
  getuserLocations() {
    this.loader = true;
    this.loginService.getUserLocations(0).subscribe({
      next: (data) => {
        this.loader = false;
        if (data.length > 0) {
          this.userlocations = data;
        }
      },
      error: (error) => {
        this.loader = false;
        console.log(error);
      },
    });
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }
  changeLanguage(language: string) {
    this.displayLanguage='';
    var selectedLanguage = sessionStorage.getItem("language")!;
    if (language == "ar") {
      this.btnArlang = "btn cursor-pointer selected";
      this.btnEnlang = "btn cursor-pointer";
     this.displayLanguage = "Arabic";
     this.removeStyle(this.themes[0].name);
     this.addStyle(this.themes[1].name, this.themes[1].styleUrls);
     sessionStorage.setItem("language","ar");
    }
    else if (language == "en") {
      this.btnEnlang = "btn selected";
      this.btnArlang = "btn";
      this.displayLanguage = "English";
      this.removeStyle(this.themes[1].name);
      this.addStyle(this.themes[0].name, this.themes[0].styleUrls);
      sessionStorage.setItem("language","en");
    }
    else {
      this.btnEnlang = "btn selected";
      this.btnArlang = "btn";
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
redirectToRegpage() {
  this.isFormSubmitted = true;  
  if(this.loginForm.valid) {

    this.router.navigate(['/patient-registration']); 
    //window.location.href="/patient-registration";  
    }
  }
  loginValidate(event: any) {
    if(event.key === "Enter") {
      this.login();
    }
  }
  login() {
    this.loader = true;
    this.errormsg = ""; this.iserror = false;
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      var hospitalDetails = this.userlocations.find((it:any) => it.name == this.loginForm.get("location")?.value);
      var hospitalId = hospitalDetails.hospitalID;
      // this.router.navigate(['/home']);
      let encryptPassword = this.encryptService.encryptData(
        this.loginForm.get('password')?.value //this.loginForm.controls.password.value
      );
      // Helper.setSessionVal('hKey2',encryptPassword);
      this.loginService.getUserCredential(this.loginForm.get('username')?.value, encryptPassword, hospitalId, "172.20.10.32") //this.loginForm.controls.username.value,
        .subscribe({
          next: async (result) => {
            this.loader = false;
            if (result != null) {
              this.userCredential = result;
              if (this.userCredential.isValid == false && this.userCredential.isLocationValid == false &&
                this.userCredential.isLocked == false) {  //&& this.userCredential.isBlocked==false
                  this.iserror = true;
                this.errormsg = "Please enter correct Username/Password";
                this.clearPassword();
                this.loader = false;
                // if (sessionStorage.getItem("count") == null ||sessionStorage.getItem("count") == "")
                //   this.loginAttemptCount = 1;
                // else
                //   this.loginAttemptCount = parseInt(sessionStorage.getItem("count")) + 1;
                  // Helper.setSessionVal("count", this.loginAttemptCount.toString());
                  this.loginAttemptCount = 9999;
                if (hospitalDetails.hospitalConfiguration.userLockAttempts <= this.loginAttemptCount) {
                  //this.updateLockUser();
                }
              } else {
                // Helper.setSessionVal("count", "0");
                //
              //   if (this.userCredential.isBlocked) {
              //     this.errormsg = "User is blocked. Please contact administrator.";
              //   }
              //  else 
               if (this.userCredential.isLocked) {
                  this.iserror = true;
                  this.errormsg = "User is locked. Please contact administrator.";
                  this.clearPassword();
                } else {
                  if (this.userCredential.isPWDExpired) {
                    this.iserror = true;
                    this.errormsg = "Your password is expired, Please contact administrator.";
                    this.clearPassword();
                  } 
                  else {
                    sessionStorage.setItem("username", this.loginForm.get('username')?.value);
                    this.router.navigate(['/patient-registration']);
                    // if (this.userCredential.userCount.activeUsers >= this.userCredential.userCount.permittedUsers) {
                    //   this.error = "Login users count is exceeded, Please contact administrator.";
                    // } 
                    // else {
                    //   let expiryDaysLeft = hospitalDetails.hospitalConfiguration.passwordLifeTime - this.userCredential.daysToExpire;
                    //   if (expiryDaysLeft < 1) {
                    //     //Update the status of user to pwdexpired
                    //     //this.error  = "Sorry, your password is expired.";
                    //     //this.updateUserPwdExpStatus();
                    //   } 
                    //   else if (expiryDaysLeft <= hospitalDetails.hospitalConfiguration.passwordAlertExpiryDays) {
                    //     // this.error = this.ts.instant("Your password will expire in ") + expiryDaysLeft + this.ts.instant (" day(s).");
                    //     // this.loading = true;
                    //     // setTimeout(async () => {
                    //     //   this.authService.setUserId(
                    //     //     this.loginForm.controls.username.value
                    //     //   );
                    //     //   Helper.setSessionVal(
                    //     //     "location",
                    //     //     this.loginForm.get("location").value
                    //     //   );
                    //     //   Helper.setSessionVal("locationId", hospitalId);
                    //     //   Helper.setSessionVal("iaCode", hospitalDetails?.iaCode);
                    //     //   Helper.setSessionVal("dateFormat", hospitalDetails?.dateFormat);
                    //     //   Helper.setSessionVal("timeFormat", hospitalDetails?.timeFormat);
                    //     //   Helper.setSessionVal('currency', hospitalDetails?.currency);
                    //     //   Helper.setSessionVal('currencyFormat', hospitalDetails?.currencyFormat);
                    //     //   Helper.setSessionVal('decimalDigits', hospitalDetails?.decimalDigits);
                    //     //   Helper.setSessionVal('userName', this.loginForm.get("username").value);
                    //     //   Helper.setSessionVal("userId", this.userCredential.userId);
                    //     //   Helper.setSessionVal("loginUserName",this.userCredential.loginUserName);
                    //     //   Helper.setSessionVal("sessionId",`${this.ipAddress}.${this.userCredential.userId}`);
                    //     //   await this.authService.setToken(this.loginForm.controls.username.value, encryptPassword);
                    //     //   this.router.navigate(["/home"]);
                    //     // }, 3000);
                    //   } 
                    //   else {
                    //     if (this.userCredential.isLocationValid) {
                    //       // this.loading = true;
                    //       // this.authService.setUserId(this.loginForm.controls.username.value);
                    //       // Helper.setSessionVal(
                    //       //   "location",
                    //       //   this.loginForm.get("location").value
                    //       // );
                    //       // Helper.setSessionVal("locationId", hospitalId);
                    //       // Helper.setSessionVal("iaCode", hospitalDetails?.iaCode);
                    //       // Helper.setSessionVal("dateFormat", hospitalDetails?.dateFormat);
                    //       // Helper.setSessionVal("timeFormat", hospitalDetails?.timeFormat);
                    //       // Helper.setSessionVal('currency', hospitalDetails?.currency);
                    //       // Helper.setSessionVal('currencyFormat', hospitalDetails?.currencyFormat);
                    //       // Helper.setSessionVal('decimalDigits', hospitalDetails?.decimalDigits);
                    //       // Helper.setSessionVal('countryID', hospitalDetails?.countryID);
                    //       // Helper.setSessionVal('currency', hospitalDetails?.currency);
                    //       // Helper.setSessionVal("userId",this.userCredential.userId);
                    //       // Helper.setSessionVal("sessionId",`${this.ipAddress}.${this.userCredential.userId}`);
                    //       // Helper.setSessionVal('userName', this.loginForm.get("username").value);
                    //       // Helper.setSessionVal("loginUserName", this.userCredential.loginUserName);
                    //       // if (this.userCredential.isDefaultPassword)
                    //       // {
                    //       //   await this.authService.setToken(this.loginForm.controls.username.value,
                    //       //     encryptPassword
                    //       //   );
                    //       //   Helper.setSessionVal("defaultPassword", "Yes");
                    //       //    this.router.navigate(["/ChangePassword"]);
                    //       // }
                    //       // else{
                    //       //   await this.authService.setToken(this.loginForm.controls.username.value, encryptPassword);
                    //       // this.router.navigate(["/home"]);
                    //       this.router.navigate(['/patient-registration']); 
                    //       // }
                    //     } else {
                    //       this.error ="Selected location is not mapped. Please contact administrator.";
                    //     }
                    //   }
                    // }
                  }
                }
                // this.getDefaultCommonHospitalConfigurations(hospitalId); //calling to set global variables
                // }
                //else{
                //   this.error = 'Selected location is not mapped. Please contact administrator.';
                // }
              }
              //console.log(result);
            } else {
              this.iserror = true;
              this.errormsg = "The specified User does not exist, please enter valid credentials.";
              this.clearPassword();
            }
          },
          error: (error) => {
            //  this.ngxService.stopLoader('login');
            this.loader = false;
            console.log(error);
          },
        });
    }
    else {
      this.loader = false;
    }
  }
  clearPassword() {
    var element = document.getElementById('password') as HTMLInputElement;
    element.value = ""; 
    element.focus();
  }
}
