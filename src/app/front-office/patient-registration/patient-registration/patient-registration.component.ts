import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as data from '../reg.json';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { Patterns } from 'src/global-constants';
import { PatientRegistrationService } from './../services/patient-registration.service';
import { map, Observable, of, startWith, Subscriber } from 'rxjs';
import { __values } from 'tslib';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import { DatePipe } from '@angular/common';
import { ViewModification } from './../models/viewmodifications.model';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Guid } from 'guid-typescript';

// import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
// import "pdfmake/build/pdfmake"
// const pdfMake: any = window["pdfMake"];
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientRegistrationComponent implements OnInit, OnChanges {
  @Input() requestInput: any;
  @ViewChild('closebutton', { static: false }) closebutton: any
  date = new FormControl(moment());
  DOB = {
    date: new Date(),
  };
  isMobileNumberSame: boolean = false;
  filePath: string = "";
  patientRegForm!: FormGroup;
  viewModificationForm!: FormGroup;
  IsEmployeeDetailsForm!: FormGroup;
  isFormSubmitted: boolean = false;
  patientRegMasterData: any;
  patientRegMasterTempData: any;
  cityAreas: any;
  Titles: any;
  Genders: any;
  AgeUOMs: any;
  MaritalStatus: any;
  Nationalities: any;
  Countries: any;
  Cities: any;
  patientInfoByYakeenService: any;
  Relations: any;
  Religions: any;
  roleText: any = '';
  tomorrow = '';
  reqToGetPatientData: any;
  patientData: any;
  isFetchPatientdata: boolean = false;
  listOfCities: any;
  filteredCities: any;
  selectedCity: any = {};
  displayStyle: string = "none";
  displayValidationStyle: string = "none";
  displayErrModal: string = "none";
  displayNoRecModal: string = "none";
  displayInfoModal: string = "none";
  displayYakeenInfoModal: string = "none";
  displayYakeenNoDataModal: string = "none";
  patientDataOnResponse: any;
  firstNameValue: string = '';
  enableSearch: boolean = true;
  specialisationResponseData: any;
  doctorandSpecialisationCombinationData: any;
  SpecializationLevelDataLoadingData: any;
  patientDataInfo: any;
  myGroup!: FormGroup;
  SpecializationLevelDataLoading: any;
  employeeDetails: any;
  doctorDropdown: any;
  avlSlot: number = 0;
  waiting: number = 0;
  qrCodeInfor: any = '';
  qrCodeInfoForAdulBandPrint: any = '';
  hijriDate: any = '';
  displayBlock: boolean = false;
  displayEmployee: boolean = false;
  disableFields: boolean = true;
  dateValue: string = '';
  dateValue1: string = '';
  timeValue: string = '';
  docName: any;
  docCode: any;
  docspecialisation: any;
  nameValue: any;
  ageValue: any;
  UHID: any;
  fetchingSerchValue: any;
  loader: boolean = false;
  isEmployeecheckbox: any;
  isVIP: any;
  ValidationMessage: string = "";
  showValidationMessage: boolean = false;
  emailPlaceholderText = 'National ID No';
  patientName2LList: any;
  familynames2lList: any;
  firstnames2lList: any;
  middlenames2lList: any;
  grandfathernames2lList: any;
  filteredfamilynames2l: any;
  filteredfirstnames2l: any;
  filteredmiddlenames2l: any;
  filteredgrandfathernames2l: any;
  selectedfamilynames2l: any = {};
  selectedfirstnames2l: any = {};
  selectedmiddlenames2l: any = {};
  selectedgrandfathernames2l: any = {};
  nationalIDSelectedFiles: any[] = [];
  showNationalIDFile: boolean = false;
  nationalIDFileName: string = '';
  fileError: string = "";
  togglebtn: string = 'toggle-arrow collapsed';
  collapsebtn: string = 'accordion-collapse collapse';
  showEligibilitydiv: boolean = false;
  ErrorMessage: string = "";
  noDataMessage: string = "No Modifications done for this patient.";
  NationalIdMessage: string = '';
  isNationalIdMessage: boolean = false;
  isTitleGenderMismatch: boolean = false;
  doctorCodeSearchText: string = "";
  lang: string = "";
  hasChange: boolean = false;
  initialValue?: any;
  AuditPatientXML: Array<ViewModification> = [];
  viewModificationList: any;
  dateChanged: boolean = false;
  ipAddress = '';
  patientID: string = "";
  regCode: string = "";
  nationalIdReqd: string = "National Id is required";
  ssnLength: string = "SSN should be 10";
  fromDate = new FormControl(new Date());
  toDate = new FormControl(new Date());
  url?: string | ArrayBuffer;
  myPhoto!: string;
  iqamaExpiryDate: string = "";
  nationalIdPhoto!: string;
  myPhotoGuid?: string;
  myNationalIdPhotoGuid?: string;
  natioanalIdUploaded: boolean = false;
  profilePhotoUploaded: boolean = false;
  displayEmployeeDetailsmodal: string = "none";
  initializeForm() {
    this.patientRegForm = this.fb.group({
      TitleID: ['', Validators.required],
      Title: [],
      NationalityID: ['', Validators.required],
      Nationality: [],
      GenderID: ['', Validators.required],
      Gender: [],
      MaritalStatusID: [0],
      MaritalStatus: [],
      ReligionID: ['', Validators.required],
      Religion: [],
      AgeUOMID: ['', Validators.required],
      Familyname: ['', Validators.required],
      MiddleName: ['', Validators.required],
      FirstName: ['', Validators.required],
      DOB: ['', Validators.required],
      GrandFatherName: [''],
      Familyname2L: [''],
      MiddleName2L: [''],
      FirstName2L: [''],
      GrandFatherName2L: [''],
      Age: ['', Validators.required],
      SSN: [
        '',
        [
          Validators.required,
          Validators.pattern(Patterns.PAT_SSN),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      PassportNo: [''],
      Isvip: [false],
      IsEmployee: [false],
      Email: ['', Validators.pattern(Patterns.PAT_EMAIL)],
      MobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(Patterns.PAT_MOBILE_NO),
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      ContactName: ['', Validators.required],
      ContRelationID: ['', Validators.required],
      ContRelation: [],
      ContPhoneNo: [
        '',
        [
          Validators.required,
          Validators.pattern(Patterns.PAT_MOBILE_NO),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      Address01: ['', Validators.required],
      CityID: ['', Validators.required],
      City: [],
      state: [''],
      country: [''],
      CountryName: [''],
      CityAreaID: [''],
      Area: [''],
      socialTypeSelection: ['nationalID', Validators.required],
      nationalIDFile: [''],
      PatientEmpId: [''],
    });
  }
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private patientRegService: PatientRegistrationService,
    private rndr2: Renderer2,
    private router: Router,
    public datepipe: DatePipe,
    private element: ElementRef,
    private dialog: DialogService
  ) {
    this.getPatientRegisterMasterData();
    this.getCityAreas();
    this.fetchAllCities();
    this.tomorrow = moment().format('dd-MMM-yyyy');
    var formatedDate = new Date(this.tomorrow).toLocaleString();
    this.ModificationForm();
    this.FillIsEmployeeDetailsForm();
  }

  ngOnInit(): void {
    this.lang = sessionStorage.getItem("language")!;
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    this.viewModificationForm.patchValue({
      fromdate: d,
      todate: this.toDate.value
    })

    this.patientRegService.getPatientID().subscribe((data: any) => {
      console.log(data);
      this.reqToGetPatientData = data;
      if (this.reqToGetPatientData != ("" && null)) {
        this.getPatientData(this.reqToGetPatientData);
      } else {
        this.backToNormalStage();
      }
    });
    console.log(Patterns);
    this.initializeForm();
    this.myGroup = new FormGroup({
      specialisationName: new FormControl(),
      DoctorName: new FormControl()
    });
    this.getSpecilisation();
    this.patientRegForm.get('Isvip')?.valueChanges.subscribe((data) => {
      if (data) {
        this.displayBlock = true
      } else {
        this.displayBlock = false
      }
    });
    this.patientRegForm.get('IsEmployee')?.valueChanges.subscribe((data) => {
      if (data) {
        this.displayEmployee = true
      } else {
        this.displayEmployee = false
      }
    });

    this.patientRegForm.get('CityID')?.valueChanges.subscribe((data) => {
      if (data?.length > 0) {
        this.listOfCities = this._filterCities(data)
      } else {
        this.listOfCities = this.filteredCities;
      }
      console.log(data)
    })

    // this.patientRegForm.get('socialTypeSelection')?.valueChanges.subscribe(x => {

    // })
    this.patientRegService.getFetchPatientData().subscribe((data: any) => {
      this.fetchingSerchValue = data;
    })
    this.patientRegService.getIsFetchPatientData().subscribe((data: any) => {
      if (data == false && this.isFetchPatientdata) {
        this.backToNormalStage()
      }
    });
    this.onChangeSocialType();
    this.onRoleChange();
    //this.getIPAddress();
  }
  // getIPAddress()
  // {
  //   this.http.get("http://172.18.17.219/MyApp/login").subscribe((res:any)=>{
  //     this.ipAddress = res.ip;
  //   });
  // }
  ModificationForm() {
    this.viewModificationList = [];
    this.viewModificationForm = this.fb.group({
      fromdate: [''],
      todate: ['']
    });
  }
  FillIsEmployeeDetailsForm() {
    this.employeeDetails = [];
    this.IsEmployeeDetailsForm = this.fb.group({
      empNo: [''],
      empName: ['']
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log("ngonchanges:");
    console.log(changes);
  }

  private _filterCities(value: any) {
    const filterValue = value.toLowerCase();
    console.log("Filter Field", filterValue)
    return this.listOfCities.filter((city: any) => city.Name.toLowerCase().includes(filterValue));
  }
  handleChange(evt: any) {
    this.disableFields = true
    if (evt.target.value == 'selfPay') {
      this.disableFields = true
      this.showEligibilitydiv = false;
      this.togglebtn = 'toggle-arrow';
      this.collapsebtn = 'accordion-collapse collapse';
    } else if (evt.target.value == 'option2') {
      this.disableFields = false
    }
  }

  /**
   * @method POST
   * @description Get all the master data for patient registration.
   */
  getPatientRegisterMasterData() {
    this.loader = true;
    let inputData = {
      Type: '1,2,5,6,9,10,12,15',
      UserID: 0,
      LanguageID: 0,
    };
    this.patientRegService.getPatientRegMasterData(inputData).subscribe(
      (response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.patientRegMasterData = response.MasterDataList;
          this.patientRegMasterTempData = this.patientRegMasterData.reduce(
            (obj: any, v: any, i: any) => {
              obj[v.TableName] = obj[v.TableName] || [];
              obj[v.TableName].push(v);
              return obj;
            },
            {}
          );
          this.Titles =
            this.patientRegMasterTempData.Titles[0].DemoGraphicsData;
          this.Genders =
            this.patientRegMasterTempData.Genders[0].DemoGraphicsData;
          this.AgeUOMs =
            this.patientRegMasterTempData.AgeUOMs[0].DemoGraphicsData;
          this.MaritalStatus =
            this.patientRegMasterTempData.MaritalStatus[0].DemoGraphicsData;
          // this.Nationalities =
          //   this.patientRegMasterTempData.Nationalities[0].DemoGraphicsData;
          this.Relations =
            this.patientRegMasterTempData.Relations[0].DemoGraphicsData;
          this.Religions =
            this.patientRegMasterTempData.Religions[0].DemoGraphicsData;
          this.Countries = this.patientRegMasterTempData.Countries[0].DemoGraphicsData;
          if (this.patientRegMasterTempData.Countries.length == 1) {
            this.patientRegForm.patchValue({
              country: this.patientRegMasterTempData.Countries[0].DemoGraphicsData[0].Id
            });
            this.patientRegService.fetchCity(this.patientRegMasterTempData.Countries[0].DemoGraphicsData[0].Id).subscribe((response) => {
              if (response.Status == 'Success' && response.Code == 200) {
                this.Cities = response.SmartDataList;
              }
            });
          }
          console.log(this.Titles);

          this.patientRegService.FetchNationalitiesPriority().subscribe(
            (response) => {
              if (response.Status == 'Success' && response.Code == 200) {
                this.Nationalities = response.SmartDataList;
              }
            })


          this.loader = false;
        } else {
          console.log(response.Status + response.Code);
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // let { MasterDataList } = data;
    // this.patientRegMasterData = MasterDataList;
    // console.log(this.patientRegMasterData)
  }
  getPatientData(reqToGetPatientData: any) {
    this.loader = true;
    if (this.reqToGetPatientData != undefined) {
      this.patientID = this.reqToGetPatientData.PatientID;
      this.regCode = this.reqToGetPatientData.RegCode;
      sessionStorage.setItem("patientID", this.patientID);
      sessionStorage.setItem("regCode", this.regCode);
      this.patientRegService.fetchPatientData(this.reqToGetPatientData).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.patientData = response.PatientData[0];
          if (this.patientData.ISVIP) {
            this.roleText = "VIP"
          } else if (this.patientData.IsEmployee) {
            this.roleText = "Employee"
          } else {
            this.roleText = ""
          }
          this.viewModificationList = [];
          this.GetViewModificationsData(this.datepipe.transform(this.viewModificationForm.value['fromdate'], "dd-MMM-yyyy")?.toString(),
            this.datepipe.transform(this.viewModificationForm.value['todate'], "dd-MMM-yyyy")?.toString());
          this.loader = false;
          this.mapDataToRegForm(this.patientData);
          if (this.patientData.PhotoPath) {
            this.DownloadProfilePhoto(this.patientData.PhotoPath, "ProfilePhoto");
          }
          if (this.patientData.StrPath) {
            this.DownloadProfilePhoto(this.patientData.StrPath, "NationalPhoto");
          }
          this.isFetchPatientdata = true;
        } else {
          this.isFetchPatientdata = false;
        }
      },
        (err) => {
          this.loader = false;
          console.log(err);
        });
    }
    else {
      this.loader = false;
      this.openNoRecFound();
    }
  };
  DownloadProfilePhoto(fileName: string, type: string) {
    this.patientRegService.DownloadProfilePhoto(fileName).subscribe(
      (response) => {
        if (response) {
          console.log(response);
          if (type == "ProfilePhoto") {
            this.myPhoto = "data:image/" + fileName.split('.')[1] + ";base64," + response;
          }
          else {
            this.nationalIdPhoto = "data:image/" + fileName.split('.')[1] + ";base64," + response;
          }
        }
      },
      (err) => {
        console.log(err)
      });

  }
  FetchViewModificationData() {
    if (this.viewModificationForm.get('fromdate')?.value != undefined)
      var FromDate = this.datepipe.transform(this.viewModificationForm.value['fromdate'], "dd-MMM-yyyy")?.toString();
    if (this.viewModificationForm.get('todate')?.value != undefined)
      var ToDate = this.datepipe.transform(this.viewModificationForm.value['todate'], "dd-MMM-yyyy")?.toString();

    this.GetViewModificationsData(FromDate, ToDate);
  }
  GetViewModificationsData(FromDate: any, ToDate: any) {
    if (this.reqToGetPatientData != undefined) {
      this.viewModificationList = [];

      this.patientRegService.fetchPatientModifications(this.reqToGetPatientData, FromDate, ToDate).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.viewModificationList = response.SmartDataList;
        } else {
          // this.displayInfoModal = "block"; 
          // this.noDataMessage = "No Modifications done for this patient."
        }
      },
        (err) => {
          this.loader = false;
          console.log(err);
        });
    }
  }
  getCityAreas() {
    let data = {
      Type: 'CityAreaID,CityID,ZoneID,Zone,Zone2L,Area,Area2L,CODE,City,City2L,Blocked,BitBlocked',
      Filter: 'Area is not null and Blocked = 0',
      UserId: 0,
      WorkStationID: 0,
    };
    this.patientRegService.fetchCityArea(data).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.cityAreas = response.CityAreaCode;
      }
    });
  }
  fetchAllCities() {
    this.patientRegService.fetchAllCities().subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        console.log(response)
        this.listOfCities = response.SmartDataList;
        this.filteredCities = response.SmartDataList
      }
    });
  }
  onChangeSocialType() {
    let socialSelectionType = this.patientRegForm.get('socialTypeSelection')?.value;
    var element = document.getElementById('txtSSN') as HTMLInputElement;
    console.log("socialSelectionType ====>", socialSelectionType);
    if (socialSelectionType == 'nationalID') {
      this.nationalIdReqd = "National ID is required";
      this.ssnLength = "SSN should be 10";
      this.patientRegForm.get('PassportNo')?.setValue('');
      //this.patientRegForm.controls['PassportNo'].removeValidators([Validators.required]);
      this.patientRegForm.get('PassportNo')?.updateValueAndValidity();
      if (this.lang == 'ar') { this.emailPlaceholderText = "الهوية الوطنية"; }
      else { this.emailPlaceholderText = 'National ID No'; }
      this.patientRegForm.get('SSN')?.setValue('');

    } else if (socialSelectionType == 'passport') {
      this.nationalIdReqd = "Passport number is required";
      this.ssnLength = "Passport should be 10";
      this.patientRegForm.get('SSN')?.setValue('');
      //this.patientRegForm.controls['SSN'].removeValidators([Validators.required]);
      this.patientRegForm.get('SSN')?.updateValueAndValidity();
      if (this.lang == 'ar') { this.emailPlaceholderText = "جواز سفر"; }
      else { this.emailPlaceholderText = 'Passport No'; }
      this.patientRegForm.get('SSN')?.setValue('');
    }
  }
  excludeSpecialChars(event: any) {
    let socialSelectionType = this.patientRegForm.get('socialTypeSelection')?.value;
    var NationalityId = this.patientRegForm.get('NationalityID')?.value;
    var NationalId = this.patientRegForm.get('SSN')?.value;
    if (socialSelectionType == 'nationalID') {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (NationalId[0] != 1 && NationalityId == "25") {
        this.isNationalIdMessage = true;
        this.NationalIdMessage = "National Id should start with 1 for Saudi Patients.";
      }
      else if (NationalId[0] != 2 && NationalityId != "25") {
        this.isNationalIdMessage = true;
        this.NationalIdMessage = "National Id should start with 2 for Non-Saudi Patients.";
      }
      else {
        this.NationalIdMessage = ""; this.isNationalIdMessage = false;
      }
      if ((charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
    else {
      var k;
      k = event.charCode;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
  }
  onCountryChange(event: any) {
    var Country = this.patientRegForm.get('country')?.value;
    this.patientRegForm.get('CountryName')?.setValue(event.target.options[event.target.options.selectedIndex].text);
    this.patientRegService.fetchCity(Country).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.Cities = response.SmartDataList;
      }
    });
  }
  onCityChange(event: any) {
    this.patientRegForm.get('City')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }
  onAreaChange(event: any) {
    this.patientRegForm.get('Area')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }
  onMaritalStatusChange(event: any) {
    this.patientRegForm.get('MaritalStatus')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }
  onReligionChange(event: any) {
    this.patientRegForm.get('Religion')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }
  onRelationToPatientChange(event: any) {
    this.patientRegForm.get('ContRelation')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }
  onNationalityChange(event: any) {
    //var NationalityId = this.patientRegForm.get('NationalityID')?.value;
    var NationalityId = this.Nationalities.find((item: any) => item?.Names === event.target.value).Id;
    this.patientRegForm.patchValue({
      NationalityID: NationalityId
    })
    var NationalId = this.patientRegForm.get('SSN')?.value;
    //this.patientRegForm.get('Nationality')?.setValue(event.target.options[event.target.options.selectedIndex].text);
    this.patientRegForm.get('Nationality')?.setValue(event.target.value);
    if (NationalityId == "25" && NationalId[0] != 1) {
      this.isNationalIdMessage = true;
      this.NationalIdMessage = "National Id should start with 1 for Saudi Patients.";
    }
    else if (NationalityId != "25" && NationalId[0] != 2) {
      this.isNationalIdMessage = true;
      this.NationalIdMessage = "National Id should start with 2 for Non-Saudi Patients.";
    }
    else {
      this.NationalIdMessage = ""; this.isNationalIdMessage = false;
    }
  }
  onRoleChange() {
    if (this.patientRegForm.get('Isvip')?.value == true) {
      this.roleText = 'VIP';
      this.patientRegForm.get('Isvip')?.setValue(1);
      this.patientRegForm.get('IsEmployee')?.disable();
    } else if (this.patientRegForm.get('IsEmployee')?.value == false) {
      this.patientRegForm.get('Isvip')?.setValue(0);
      this.patientRegForm.get('IsEmployee')?.enable();
    }

    if (this.patientRegForm.get('IsEmployee')?.value == true) {
      this.patientRegForm.get('IsEmployee')?.setValue(1);
      this.roleText = 'Employee';
      this.patientRegForm.get('Isvip')?.disable();
    } else if (this.patientRegForm.get('IsEmployee')?.value == false) {
      this.patientRegForm.get('IsEmployee')?.setValue(0);
      this.patientRegForm.get('Isvip')?.enable();
    }
    if (
      this.patientRegForm.get('IsEmployee')?.value == false &&
      this.patientRegForm.get('Isvip')?.value == false
    ) {
      this.roleText = ' ';
    }
  }
  onTitleChange(event: any) {
    var TitleID = this.patientRegForm.get('TitleID')?.value;
    this.patientRegForm.get('Title')?.setValue(event.target.options[event.target.options.selectedIndex].text);
    this.patientRegForm.patchValue({
      TitleID: TitleID
    })
    if (TitleID != '') {
      if (TitleID == 1) {
        this.patientRegForm.get('GenderID')?.setValue(1);
        this.patientRegForm.get('Gender')?.setValue("Male");
      }
      else if (TitleID == 2) {
        this.patientRegForm.get('GenderID')?.setValue(2);
        this.patientRegForm.get('Gender')?.setValue("Female");
      }
      else if (TitleID == 28) {
        this.patientRegForm.get('GenderID')?.setValue(2);
        this.patientRegForm.get('Gender')?.setValue("Female");
      }
      else {
        this.patientRegForm.get('GenderID')?.setValue('');
      }
    }
  }
  onGenderChange(event: any) {
    var Genderid = this.patientRegForm.get('GenderID')?.value;
    this.patientRegForm.get('Gender')?.setValue(event.target.options[event.target.options.selectedIndex].text);
    if (Genderid != '') {
      if (Genderid == 1) {
        this.patientRegForm.get('TitleID')?.setValue(1);
      }
      else if (Genderid == 2) {
        this.patientRegForm.get('TitleID')?.setValue(2);
      }
      else if (Genderid == 28) {
        this.patientRegForm.get('TitleID')?.setValue(2);
      }
      else {
        this.patientRegForm.get('TitleID')?.setValue('');
      }
    }
  }
  onAgeChange() {
    var age = this.patientRegForm.get('Age')?.value;
    var ageUomid = this.patientRegForm.get('AgeUOMID')?.value;
    if (age != "" && ageUomid != "") {
      this.patientRegService.fetchDOBByAge(age, ageUomid).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          var actualDate = response.SmartDataList[0].DOB;
          this.patientRegForm.patchValue({
            DOB: response.SmartDataList[0].DOB
          })
          const date = new Date(actualDate);
          const reqDate = `${date.getDate()}-${date.toLocaleString("en-US", { month: "short" })}-${date.getFullYear()}`;
          let reqData = {
            GDOB: reqDate
          }
          this.patientRegService.getHijriDate(reqData).subscribe((data) => {
            this.hijriDate = data.SmartDataList[0].HijriDate;
          });
        }
      });

    }
  }
  viewUploadedDocs() {
    this.displayInfoModal = "block";
    this.noDataMessage = "No Documents Uploaded."
  }
  closeInfoModalpopup() {
    this.displayInfoModal = "none";
  }
  onChangeDate(event: any) {
    var today = new Date();
    if (event.value._d.getTime() <= today.getTime()) {
      let dob = event.value._d.toDateString();// event.target.value.replace('T', ' ');
      this.dateChanged = true;
      this.patientRegService.fetchAge(dob).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.patientRegForm.patchValue({
            Age: response.SmartDataList[0].Age,
            AgeUOMID: response.SmartDataList[0].Ageuomid
          })
          console.log(response.SmartDataList);
        }
      });
      const date = new Date(event.value._d.toDateString())
      const reqDate = `${date.getDate()}-${date.toLocaleString("en-US", { month: "short" })}-${date.getFullYear()}`;
      let reqData = {
        GDOB: reqDate
      }
      this.patientRegService.getHijriDate(reqData).subscribe((data) => {
        this.hijriDate = data.SmartDataList[0].HijriDate;
      });
    }
    else {
      this.openErrorPopup(); this.ErrorMessage = "Date of birth cannot be future dates";
    }
  }
  onSelectCity(city: any) {
    console.log("Selected City====>", city);
    this.selectedCity = city;
    this.patientRegForm.patchValue({
      country: city.Country,
      state: city.StateName
    });
    // this.patientRegForm.get("CityID")?.setValue(city.CityID);
  }
  getFamilyName2L(event: any) {
    var name2L = event.target.value;
    if (name2L.length > 2) {
      this.patientRegService.getPatientName2l(name2L).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.familynames2lList = response.SmartDataList;
        }
      });
    }
  }
  getFirstName2L(event: any) {
    var name2L = event.target.value;
    if (name2L.length > 2) {
      this.patientRegService.getPatientName2l(name2L).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.firstnames2lList = response.SmartDataList;
        }
      });
    }
  }
  getGrandfatherName2L(event: any) {
    var name2L = event.target.value;
    if (name2L.length > 2) {
      this.patientRegService.getPatientName2l(name2L).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.grandfathernames2lList = response.SmartDataList;
        }
      });
    }
  }
  getMiddleName2L(event: any) {
    var name2L = event.target.value;
    if (name2L.length > 2) {
      this.patientRegService.getPatientName2l(name2L).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.middlenames2lList = response.SmartDataList;
        }
      });
    }
  }
  onSelectFamilyname2l(familyname2l: any) {
    this.selectedfamilynames2l = familyname2l;
    this.patientRegForm.patchValue({
      Familyname2L: familyname2l
    });
  }
  onSelectFirstname2l(firstname2l: any) {
    this.patientRegForm.patchValue({
      FirstName2L: firstname2l
    });
  }
  onSelectGrandfathername2l(grandfathername2l: any) {
    this.patientRegForm.patchValue({
      GrandFatherName2L: grandfathername2l
    });
  }
  onSelectMiddlename2l(middlename2l: any) {
    this.patientRegForm.patchValue({
      MiddleName2L: middlename2l
    });
  }
  fetchEnglishDate(eve: any) {
    console.log('eve for fetch english date is :  ', eve.target.value);
    const date = new Date(eve.target.value)
    let reqDate = {
      // "HDOB": `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
      "HDOB": eve.target.value
    }
    this.patientRegService.getEnglishDate(reqDate).subscribe((response) => {
      console.log(response.SmartDataList[0].Age);
      this.patientRegForm.patchValue({
        //DOB: response.SmartDataList[0].EnglishDate,
        DOB: moment(response.SmartDataList[0].EnglishDate).format('yyyy-MM-DD'),
        Age: response.SmartDataList[0].Age
      })
    });
  }
  mapDataToRegForm(patientData: any) {
    console.log("Patient Data", patientData);
    //this.nameValue = patientData.Familyname + " "+ patientData.FirstName+ " " + patientData.MiddleName  ;
    if (this.lang == 'ar') { this.nameValue = patientData.FirstName2l + " " + patientData.MiddleName2l + " " + patientData.Familyname2l; }
    else { this.nameValue = patientData.FirstName + " " + patientData.MiddleName + " " + patientData.Familyname; }
    this.ageValue = patientData.Age;
    this.UHID = patientData.SSN;
    this.isEmployeecheckbox = patientData.IsEmployee;
    this.isVIP = patientData.ISVIP;
    // if(patientData.scanDocumentPath.trim()!="" && patientData.scanDocumentPath.trim()!=" ")
    // {
    //   this.nationalIDFileName= patientData.scanDocumentPath;
    //   this.showNationalIDFile=true;
    //   this.patientRegForm.get('nationalIDFile')?.setValue(this.patientData.scanDocumentPath);
    // }
    this.patientRegService.fetchCity(patientData.CountryID).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.Cities = response.SmartDataList;
      }
    });
    this.patientRegForm.patchValue({
      TitleID: patientData.TitleID,
      Title: patientData.Title,
      Familyname: patientData.Familyname,
      GenderID: patientData.GenderID,
      Gender: patientData.Gender,
      MaritalStatusID: patientData.MaritalStatusID ? patientData.MaritalStatusID : 0,
      ReligionID: patientData.ReligionID,
      AgeUOMID: patientData.AgeUOMID,
      socialTypeSelection: this.getsocialTypeSelection(patientData),
      MiddleName: patientData.MiddleName,
      FirstName: patientData.FirstName,
      DOB: moment(patientData.DOB).format('yyyy-MM-DD'),
      //DOB: this.datepipe.transform(patientData.DOB, 'dd-MMM-yyyy'),
      Age: patientData.Age,
      GrandFatherName: patientData.GrandFatherName,
      Familyname2L: patientData.Familyname2l,
      FirstName2L: patientData.FirstName2l,
      GrandFatherName2L: patientData.GrandFatherName2L,
      MiddleName2L: patientData.MiddleName2l,
      Email: patientData.Email,
      NationalityID: this.Nationalities.find((item: any) => item?.Id === patientData.NationalityID).Id, //patientData.NationalityID,
      Address01: patientData.Address01,
      state: patientData.State,
      country: patientData.CountryID,
      CityAreaID: patientData?.CityAreaID,
      ContPhoneNo: patientData.ContPhoneNo,
      ContRelationID: patientData.ContRelationID,
      ContRelation: patientData.ContRelation,
      ContactName: patientData.ContactName,
      MobileNo: patientData.MobileNo,
      SSN: patientData.SSN,
      MaritalStatus: patientData.MarStatus,
      Nationality: patientData.Nationality,
      Religion: patientData.Religion,
      CountryName: patientData.CountryName,
      CityID: patientData.CityID,
      City: patientData.City,
      Area: patientData.CityArea,
      PassportNo: patientData.PassportNo,
      Isvip: patientData.ISVIP == (0 || false) ? false : true,
      IsEmployee: patientData.IsEmployee == (0 || false) ? false : true,
      PatientEmpId: patientData.PatientEmpID
    })
    if (patientData.IsEmployee) {
      this.onRoleChange();
    }
    const date = new Date(patientData.DOB);
    const reqDate = `${date.getDate()}-${date.toLocaleString("en-US", { month: "short" })}-${date.getFullYear()}`;
    let reqData = {
      GDOB: reqDate
    }
    this.patientRegService.getHijriDate(reqData).subscribe((data) => {
      this.hijriDate = data.SmartDataList[0].HijriDate;
    });

    console.log("Mapped data", this.patientRegForm.value)
    this.initialValue = this.patientRegForm.value;

  }
  getsocialTypeSelection(patientData: any) {
    let socialTypeSelection: any;
    if (patientData.SSN != "") {
      socialTypeSelection = "nationalID";
    } else if (patientData.PassportNo != "") {
      socialTypeSelection = "passport";
    }
    return socialTypeSelection;
  }
  getEmployee() {
    if (this.patientRegForm.value.IsEmployee == true) { return 1; }
    else { return 0 }
    //return this.patientRegForm.value.IsEmployee == true ? 0 : this.patientRegForm.value.IsEmployee == false ? 0 : 1
  }
  getVIP() {
    //return this.patientRegForm.value.IsEmployee == true ? 0 : this.patientRegForm.value.Isvip == false ? 0 : 1
    if (this.patientRegForm.value.Isvip == true) { return 1; }
    else { return 0; }
  }
  searchCity(event: any) {
    console.log(event?.target.value)
  }
  checkMobileNummber() {
    if (this.patientRegForm.value.ContPhoneNo === this.patientRegForm.value.MobileNo) {
      this.isMobileNumberSame = true;
    } else {
      this.isMobileNumberSame = false;
    }
  }
  openCollapseEligibility() {
    if (!this.showEligibilitydiv) {
      this.showEligibilitydiv = true;
      this.togglebtn = 'toggle-arrow collapsed';
      this.collapsebtn = 'accordion-collapse collapse show';
    }
    else {
      this.showEligibilitydiv = false;
      this.togglebtn = 'toggle-arrow';
      this.collapsebtn = 'accordion-collapse collapse';
    }
  }
  ClearScreen() {
    //this.router.navigate('/patient-registration');
    //window.location.reload();
    this.clearForm();
  }
  CheckValidation() {
    if (this.isFormSubmitted == false) {
      this.displayValidationStyle = "block";
      return false;
    }
    else { return true; }
  }
  FillModifiedData(key: string) {
    switch (key) {
      case "DOB":
        if (this.dateChanged) {
          this.AuditPatientXML.push({
            APPLN: "Patient Registration",
            DBC: key,
            UPV: this.patientRegForm.value[key]._d.getDate() + '-' + (this.datepipe.transform(this.patientRegForm.value[key]._d.getMonth() + 1, "MMM")) + '-' + this.patientRegForm.value[key]._d.getFullYear(),
            PRV: this.datepipe.transform(this.initialValue[key], 'dd-MMM-yyyy')?.toString(),
            UID: "1",
            WID: "1",
            HName: "1"
          });
        }
        else {
          this.AuditPatientXML.push({
            APPLN: "Patient Registration",
            DBC: key,
            UPV: this.datepipe.transform(this.patientRegForm.value[key], 'dd-MMM-yyyy')?.toString(),
            PRV: this.datepipe.transform(this.initialValue[key], 'dd-MMM-yyyy')?.toString(),
            UID: "1",
            WID: "1",
            HName: "1"
          });
        }
        break;
      case "NationalityID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Nationality",
          UPV: this.patientRegForm.value["Nationality"],
          PRV: this.initialValue['Nationality'],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "GenderID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Gender",
          UPV: this.patientRegForm.value["Gender"],
          PRV: this.initialValue["Gender"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "MaritalStatusID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "MaritalStatus",
          UPV: this.patientRegForm.value["MaritalStatus"],
          PRV: this.initialValue["MaritalStatus"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "ReligionID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Religion",
          UPV: this.patientRegForm.value["Religion"],
          PRV: this.initialValue["Religion"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "CountryID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Country",
          UPV: this.patientRegForm.value["Country"],
          PRV: this.initialValue["Country"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "CityID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "City",
          UPV: this.patientRegForm.value["City"],
          PRV: this.initialValue["City"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "CityAreaID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Area",
          UPV: this.patientRegForm.value["Area"],
          PRV: this.initialValue["Area"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "TitleID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Title",
          UPV: this.patientRegForm.value["Title"],
          PRV: this.initialValue["Title"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      case "ContRelationID":
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: "Relation To Patient",
          UPV: this.patientRegForm.value["ContRelation"],
          PRV: this.initialValue["ContRelation"],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
      default:
        this.AuditPatientXML.push({
          APPLN: "Patient Registration",
          DBC: key,
          UPV: this.patientRegForm.value[key],
          PRV: this.initialValue[key],
          UID: "1",
          WID: "1",
          HName: "1"
        });
        break;
    }
  }
  onSubmit(event: any) {
    this.isFormSubmitted = true
    if (this.patientRegForm.valid && !this.isNationalIdMessage && !this.isMobileNumberSame) {
      console.log('this.selectedCity', this.selectedCity);
      // console.log(event.target.value)
      //console.log(Object.entries(this.patientRegForm.controls).map(([key, { errors }]) => [key, errors]))
      console.log(this.patientRegForm.value);
      this.loader = true;
      // if (this.patientRegForm.valid && !this.isMobileNumberSame) {      
      if (this.myPhoto && this.profilePhotoUploaded) {
        var filext = this.myPhoto.split('/')[1].split(';')[0];
        var guid = Guid.create();
        this.myPhotoGuid = this.patientRegForm.get('SSN')?.value + "_" + guid + "." + filext;
      }
      else {
        this.myPhotoGuid = this.patientData ? this.patientData.PhotoPath : "";
      }
      if (this.nationalIdPhoto && this.natioanalIdUploaded) {
        var filext = this.nationalIdPhoto.split('/')[1].split(';')[0];
        var guid = Guid.create();
        this.myNationalIdPhotoGuid = "Iqama_" + this.patientRegForm.get('SSN')?.value + "_" + guid + "." + filext;
      }
      else {
        this.myNationalIdPhotoGuid = this.patientData ? this.patientData.StrPath : "";
      }

      let postData = {
        "PatientId": this.isFetchPatientdata ? this.patientData.PatientID : null,
        "RegCode": this.isFetchPatientdata ? this.patientData.RegCode : "",
        "Familyname2L": this.patientRegForm.get('Familyname2L')?.value,
        "FirstName2L": this.patientRegForm.get('FirstName2L')?.value,
        "MiddleName2L": this.patientRegForm.get('MiddleName2L')?.value,
        "GrandFatherName2L": this.patientRegForm.get('GrandFatherName2L')?.value,
        "IsAgeByDOB": 0,
        "PatientEmpId": this.patientRegForm.get('PatientEmpId')?.value | 0,
        "PhotoPath": this.myPhotoGuid,
        "strpath": this.myNationalIdPhotoGuid,
        "HospitalID": 3,
        "multipleInsurance": [],
        "USERID": 4394,
        "WORKSTATIONID": 1381,
        "IsServicePatient": 0,
        "PatientType": 1,
        "CityAreaID": this.patientRegForm.get('CityAreaID')?.value | 0,
        "TitleID": this.patientRegForm.get('TitleID')?.value,
        "GenderID": this.patientRegForm.get('GenderID')?.value,
        "Familyname": this.patientRegForm.get('Familyname')?.value,
        "FirstName": this.patientRegForm.get('FirstName')?.value,
        "MiddleName": this.patientRegForm.get('MiddleName')?.value,
        "GrandFatherName": this.patientRegForm.get('GrandFatherName')?.value,
        "DOB": this.patientRegForm.get('DOB')?.value,
        "AgeUOMID": this.patientRegForm.get('AgeUOMID')?.value,
        "ReligionID": this.patientRegForm.get('ReligionID')?.value,
        "MaritalStatusID": this.patientRegForm.get('MaritalStatusID')?.value | 0,
        "Address01": this.patientRegForm.get('Address01')?.value,
        "PhoneNo": this.patientRegForm.get('PhoneNo')?.value,
        "MobileNo": this.patientRegForm.get('MobileNo')?.value,
        "EMail": this.patientRegForm.get('EMail')?.value,
        "NationalityId": this.patientRegForm.get('NationalityID')?.value,
        "SSN": this.patientRegForm.get('SSN')?.value,
        "PassportNo": this.patientRegForm.get('PassportNo')?.value,
        "ContactName": this.patientRegForm.get('ContactName')?.value,
        "ContRelationId": this.patientRegForm.get('ContRelationID')?.value,
        "ContPhoneNo": this.patientRegForm.get('ContPhoneNo')?.value,
        Age: parseInt(this.patientRegForm.value.Age),
        Isvip: this.getVIP(),
        IsEmployee: this.getEmployee(),
        "CityID": this.isFetchPatientdata ? this.patientData.CityID : this.patientRegForm.get('CityID')?.value,
        "AuditPatientXML": this.AuditPatientXML ? this.AuditPatientXML : "0"
      };
      //if(!postData.IsEmployee) { postData.PatientEmpId = 1; }
      console.log('postData &&&&&&&&&&&&&&&&&&&&&', postData);
      if (this.dateChanged) {
        postData.DOB = postData.DOB._d.getDate() + '-' + (this.datepipe.transform(postData.DOB._d.getMonth() + 1, "MMM")) + '-' + postData.DOB._d.getFullYear();
      }
      else {
        postData.DOB = this.datepipe.transform(postData.DOB, 'dd-MMM-yyyy');
      }
      if (event.target.textContent === 'Modify') {
        Object.keys(this.patientRegForm.value).forEach(key => {
          if (this.initialValue[key] !== this.patientRegForm.value[key]
            && key != "Nationality" && key != "Gender" && key != "Religion" && key != "MaritalStatus" && key != "City" && key != "Area"
            && key != "Country" && key != "Title" && key != "ContRelation") {
            //console.log(key, this.initialValue[key], this.patientRegForm.value[key])          
            this.FillModifiedData(key);
          }
        })
      }
      this.patientRegService.savePatientData(postData, this.isFetchPatientdata).subscribe(
        (response) => {
          if (response.Status == "Success" && response.Code == 200) {
            if (response.RegCode != null) {
              this.patientDataOnResponse = response;
              console.log(response);
              this.loader = false;
              if (this.myPhoto && this.profilePhotoUploaded && postData.PhotoPath) {
                this.UploadPhotoToFTP(postData.PhotoPath, "ProfilePhoto");
              }
              if (this.nationalIdPhoto && this.natioanalIdUploaded && postData.strpath) {
                this.UploadPhotoToFTP(postData.strpath, "NationalIdPhoto");
              }
              this.openPopup();
            }
            else {
              this.loader = false; this.openErrorPopup(); this.ErrorMessage = response.Message;
            }
          } else {
            console.log(response.Status + response.Code);
            this.loader = false;
            this.openErrorPopup();
          }
        },
        (err) => {
          console.log(err)
        });
    }
    else {
      this.loader = false;
    }
  }
  UploadPhotoToFTP(filename: string, type: string) {
    if (type == "NationalIdPhoto") {
      var myprofPhoto = this.nationalIdPhoto.split(',')[1];
      this.patientRegService.PhotoUpload(filename, myprofPhoto).subscribe(
        (response) => {
          if (response.Status == "Success" && response.Code == 200) {
            console.log(response);
          }
        },
        (err) => {
          console.log(err)
        });
    }
    else {
      var myprofPhoto = this.myPhoto.split(',')[1];
      this.patientRegService.PhotoUpload(filename, myprofPhoto).subscribe(
        (response) => {
          if (response.Status == "Success" && response.Code == 200) {
            console.log(response);
          }
        },
        (err) => {
          console.log(err)
        });
    }

  }
  ngOnDestroy() {

  }
  openPopup() {
    this.displayStyle = "block";
  }
  openErrorPopup() {
    this.displayErrModal = "block";
  }
  openValidationPopup() {
    this.displayValidationStyle = "block";
  }
  openNoRecFound() {
    this.displayNoRecModal = "block";
  }
  closeNoRecFound() {
    this.displayNoRecModal = "none";
  }
  closeErrorPopup() {
    this.ErrorMessage = "";
    this.displayErrModal = "none";
  }
  closeValidationPopup() {
    this.displayValidationStyle = "none";
  }
  closePopup() {
    this.displayStyle = "none";
    this.isFetchPatientdata = false;
    this.patientRegService.setIsFetchPatientData(this.isFetchPatientdata);
    this.backToNormalStage();
    this.patientRegForm.markAsPristine()
    this.patientRegForm.markAsUntouched()
    this.patientRegForm.get('TitleID')?.setErrors(null)
    this.patientRegForm.get('Familyname')?.setErrors(null)
    this.patientRegForm.get('FirstName')?.setErrors(null)
    this.patientRegForm.get('MiddleName')?.setErrors(null)
    this.patientRegForm.get('GrandFatherName')?.setErrors(null)
    this.patientRegForm.get('Age')?.setErrors(null)
    this.patientRegForm.get('DOB')?.setErrors(null)
    this.patientRegForm.get('SSN')?.setErrors(null)
    this.patientRegForm.get('MobileNo')?.setErrors(null)
    this.patientRegForm.get('ContPhoneNo')?.setErrors(null)
    this.patientRegForm.get('GenderID')?.setErrors(null)
    this.patientRegForm.get('ReligionID')?.setErrors(null)
    this.patientRegForm.get('NationalityID')?.setErrors(null)
    this.patientRegForm.get('Address01')?.setErrors(null)
    this.patientRegForm.get('CityID')?.setErrors(null)
    this.patientRegForm.get('ContactName')?.setErrors(null)
    this.patientRegForm.get('ContRelationID')?.setErrors(null)
    this.hijriDate = ""; this.AuditPatientXML = [];
    this.patientRegForm.get('IsEmployee')?.setValue(0);
    this.patientRegForm.get('Isvip')?.setValue(0);
    this.patientRegForm.get('IsEmployee')?.enable();
    this.patientRegForm.get('Isvip')?.enable();
    this.myPhoto = ""; this.nationalIdPhoto = "";
  }
  backToNormalStage() {
    this.getPatientRegisterMasterData();
    this.getCityAreas();
    //this.fetchAllCities();
    this.patientData = [];
    this.patientRegForm.reset();
    this.patientRegForm.patchValue({
      Isvip: false,
      socialTypeSelection: "nationalID",
      IsEmployee: false
    });
  }

  clearForm() {
    this.backToNormalStage();
    this.patientRegForm.markAsPristine()
    this.patientRegForm.markAsUntouched()
    this.patientRegForm.get('TitleID')?.setErrors(null)
    this.patientRegForm.get('Familyname')?.setErrors(null)
    this.patientRegForm.get('FirstName')?.setErrors(null)
    this.patientRegForm.get('MiddleName')?.setErrors(null)
    this.patientRegForm.get('GrandFatherName')?.setErrors(null)
    this.patientRegForm.get('Familyname2L')?.setErrors(null)
    this.patientRegForm.get('FirstName2L')?.setErrors(null)
    this.patientRegForm.get('MiddleName2L')?.setErrors(null)
    this.patientRegForm.get('GrandFatherName2L')?.setErrors(null)
    this.patientRegForm.get('DOB')?.setErrors(null)
    this.patientRegForm.get('SSN')?.setErrors(null)
    this.patientRegForm.get('MobileNo')?.setErrors(null)
    this.patientRegForm.get('ContPhoneNo')?.setErrors(null)
    this.patientRegForm.get('GenderID')?.setErrors(null)
    this.patientRegForm.get('ReligionID')?.setErrors(null)
    this.patientRegForm.get('NationalityID')?.setErrors(null)
    this.patientRegForm.get('Address01')?.setErrors(null)
    this.patientRegForm.get('CityID')?.setErrors(null)
    this.patientRegForm.get('ContactName')?.setErrors(null)
    this.patientRegForm.get('ContRelationID')?.setErrors(null)
    this.patientRegForm.get('FullName')?.setErrors(null)
    this.patientRegForm.get('Gender')?.setErrors(null)
    this.patientRegForm.get('FullAge')?.setErrors(null)
    this.hijriDate = ''; this.AuditPatientXML = [];
    this.myPhoto = ""; this.nationalIdPhoto = "";
    this.patientRegForm.get('IsEmployee')?.setValue(0);
    this.iqamaExpiryDate = "";
  }

  // Doctor Availability Functionality
  specialisationChange(e: any) {
    if (this.myGroup.get('specialisationName')?.value) {
      this.enableSearch = false;
    }
    this.getDoctor();
    this.getSpecilisationData();
  }
  DoctorChange(e: any) {

    this.getDoctorData();

  }

  Search(specialisation: any, doctor: any) {
    if (specialisation.value && doctor.value) {
      this.getDoctorData()
    } else if (specialisation.value) {
      this.getSpecilisationData()
    }
  }

  getSpecilisation() {
    this.loader = true;
    const SpecialisationReq = {
      "Type": "distinct SpecialiseID id,Specialisation name,Specialisation2l name2L,SpecializationCode code,blocked,Blocked BitBlocked",
      "Filter": "IsConsPri=1 and Blocked=0",
      "UserId": 4394,
      "WorkStationID": 3392
    }
    this.patientRegService.getSpecialisation(SpecialisationReq).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.specialisationResponseData = response.DoctorAvailCode;
        this.loader = false;
      }
    });
  }

  getDoctor() {
    this.loader = true
    const doctorReq = {
      "Specialiseid": this.myGroup.get('specialisationName')?.value,
      "HospitalID": 3
    }
    this.patientRegService.getDoctor(doctorReq).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.doctorDropdown = response.DoctorAvailCode;
        this.loader = false;
      }
    });
  }

  getSpecilisationData() {
    this.loader = true;
    const SpecialisarionReqData = {
      "Specialiseid": this.myGroup.get('specialisationName')?.value,
      "DoctorCode": '0',
      "HospitalID": 3
      // "UserID": 0,
      // "WorkStationID": 0
    }
    this.patientRegService.getSpecialisationData(SpecialisarionReqData).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.SpecializationLevelDataLoading = response.DoctorAvailCode
        // response.DoctorAvailCode.forEach((element: any) => {
        //   element.avlSlot = element.TotalAppointments - element.TotalBills;
        //   element.waiting = element.TotalBills - element.Visited;
        //   console.log('SpecializationLevelDataLoadingData : ', element);
        // });
        this.SpecializationLevelDataLoadingData = this.SpecializationLevelDataLoading.map((object: any) => {
          console.log('map object is : ', object);
          this.avlSlot = object.TotalAppointments - object.TotalBills;
          this.waiting = object.TotalBills - object.Visited;
          // console.log('map object is : ',this.avlSlot);
          return { ...object, 'avlSlot': this.avlSlot, 'waiting': this.waiting }
        })
        this.loader = false;
      }
    });
  }

  getDoctorData() {
    this.loader = true;
    const doctorReqData = {
      "Specialiseid": this.myGroup.get('specialisationName')?.value,
      "DoctorID": this.myGroup.get('DoctorName')?.value,
      "HospitalID": 3
    }
    this.patientRegService.getDoctorData(doctorReqData).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {
        this.SpecializationLevelDataLoading = response.DoctorAvailCode
        this.SpecializationLevelDataLoadingData = this.SpecializationLevelDataLoading.map((object: any) => {
          console.log('map object is : ', object);
          this.avlSlot = object.TotalAppointments - object.TotalBills;
          this.waiting = object.TotalBills - object.Visited;
          // console.log('map object is : ',this.avlSlot);
          return { ...object, 'avlSlot': this.avlSlot, 'waiting': this.waiting }
        })
        this.loader = false;
      }
      else {
        this.loader = false;
      }
    });
  }
  onSearchEmployee(event: any, empType: string) {
    var empdet = event.target.value;
    if (event.key === "Enter") {
      this.loader = true;
      var filter;
      if (empType == "EmpNo") { filter = "EmpNo  LIKE '%" + empdet + "%' AND HospitalID=2"; }
      else if (empType == "EmpName") { filter = "FullName LIKE '%" + empdet + "%' AND HospitalID=2"; }
      else { filter = " EmpNo  LIKE '%6700%' AND HospitalID=2"; }
      const EmployeeReqData = {
        "Filter": "EmpID > -1 AND " + filter,
        "UserID": 0,
        "WorkStationId": 3392
      }
      this.patientRegService.FetchAllEmployees(EmployeeReqData).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.employeeDetails = response.SmartDataList;
          this.loader = false;
        }
        else { this.loader = false; }
      });
    }
  }
  onEmployeeSelect(employee: any) {
    this.patientRegForm.patchValue({
      PatientEmpId: employee.EmpID
    })
    this.patientRegForm.patchValue({
      IsEmployee: true
    })
    this.onRoleChange();
    if (!this.patientData) {
      const FetchEmployee = {
        "EmpID": employee.EmpID,
        "UserID": 0,
        "WorkStationId": 0
      }
      this.patientRegService.FetchEmployee(FetchEmployee).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          //console.log(response)    
          this.patientRegForm.patchValue({
            TitleID: response.SmartDataList[0].TitleID,
            Title: response.SmartDataList[0].Title,
            Familyname: response.SmartDataList[0].FamilyName,
            GenderID: response.SmartDataList[0].GenderID,
            Gender: response.SmartDataList[0].Gender,
            MaritalStatusID: response.SmartDataList[0].MaritalStatusID,
            //AgeUOMID: response.SmartDataList[0].FamilyName,
            MiddleName: response.SmartDataList[0].MiddleName,
            FirstName: response.SmartDataList[0].FirstName,
            DOB: moment(response.SmartDataList[0].DoB).format('yyyy-MM-DD'),
            //Age: response.SmartDataList[0].FamilyName,
            Familyname2L: response.SmartDataList[0].FamilyName2L,
            FirstName2L: response.SmartDataList[0].FirstName2L,
            MiddleName2L: response.SmartDataList[0].MiddleName2L,
            MobileNo: response.SmartDataList[0].MobileNo,
            SSN: response.SmartDataList[0].SSN.trim(),
            MaritalStatus: response.SmartDataList[0].MaritalStatus,
            Nationality: response.SmartDataList[0].Nationality,
            NationalityID: response.SmartDataList[0].NationalityID,
            Religion: response.SmartDataList[0].ReligionID,
            CityID: response.SmartDataList[0].CityID,
            City: response.SmartDataList[0].City,
            IsEmployee: true
          })
          this.patientRegService.fetchAge(response.SmartDataList[0].DoB).subscribe((response) => {
            if (response.Status == 'Success' && response.Code == 200) {
              this.patientRegForm.patchValue({
                Age: response.SmartDataList[0].Age,
                AgeUOMID: response.SmartDataList[0].Ageuomid
              })
              console.log(response.SmartDataList);
            }
          });
          const date = new Date(response.SmartDataList[0].DoB);
          const reqDate = `${date.getDate()}-${date.toLocaleString("en-US", { month: "short" })}-${date.getFullYear()}`;
          let reqData = {
            GDOB: reqDate
          }
          this.patientRegService.getHijriDate(reqData).subscribe((data) => {
            this.hijriDate = data.SmartDataList[0].HijriDate;
          });
          this.loader = false;

        }
        else { this.loader = false; }
      });
    }
    this.closeEmployeeDetailsPopup();
  }
  onSearchDoctor(event: any) {
    var doccode = event.target.value;
    if (event.key === "Enter") {
      this.loader = true;
      const SpecialisarionReqData = {
        "Specialiseid": 0,
        "DoctorCode": doccode,
        "HospitalID": 3
      }
      this.patientRegService.getSpecialisationData(SpecialisarionReqData).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          this.SpecializationLevelDataLoading = response.DoctorAvailCode
          this.SpecializationLevelDataLoadingData = this.SpecializationLevelDataLoading.map((object: any) => {
            console.log('map object is : ', object);
            this.avlSlot = object.TotalAppointments - object.TotalBills;
            this.waiting = object.TotalBills - object.Visited;
            return { ...object, 'avlSlot': this.avlSlot, 'waiting': this.waiting }
          })
          this.loader = false;
        }
        else { this.loader = false; }
      });
    }
  }
  clearfields() {
    this.myGroup.reset();
    this.SpecializationLevelDataLoadingData = [];
    this.specialisationResponseData = [];
    this.doctorDropdown = [];
    var element = document.getElementById('doctorCodeSearchText') as HTMLInputElement;
    element.value = "";
    this.getSpecilisation();
  }

  getID(event: any, Specialisation: any) {
    const boxes = document.querySelectorAll('.selected');

    boxes.forEach(box => {
      box.classList.remove('selected');
    });
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    if (this.lang == 'ar') { this.docName = Specialisation.DoctorName2L; }
    else { this.docName = Specialisation.DoctorName; }
    this.docCode = Specialisation.DoctorCode;
    if (this.lang == 'ar') { this.docspecialisation = Specialisation.Specialisation2L; }
    else { this.docspecialisation = Specialisation.Specialisation; }
    console.log('id val is :', value, Specialisation, this.docName, this.docspecialisation);
    this.rndr2.addClass(event.target, 'selected')
    const dtvalue = new Date()
    this.dateValue = dtvalue.toDateString();
    //this.datepipe.transform(dtvalue.getDate(), "dd") + '-' + (this.datepipe.transform(dtvalue.getMonth() + 1, "MMM")) + '-' + dtvalue.getFullYear();
    // this.timeValue = dtvalue.getHours() + ":" + dtvalue.getMinutes() + ":" + dtvalue.getSeconds();
    this.formatAMPM(new Date)
  }

  formatAMPM(date: any) {
    const dtvalue = new Date()
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    this.timeValue = strTime;
    console.log('time is :', this.timeValue);
    return strTime;
  }


  // Generate PDF with QR code
  public generatePDF() {
    var data = document.getElementById("DownloadPdf");
    if (data !== null) {
      html2canvas(data).then((canvas: any) => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        pdf.save("MYPdf.pdf"); // Generated PDF
      });
      this.closebutton.nativeElement.click();
    }
  }

  public generateAdultBandPDF() {
    var data = document.getElementById("DownloadAdultBand");
    if (data !== null) {
      html2canvas(data).then((canvas: any) => {
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL("image/png");
        let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        pdf.save("MYPdf.pdf"); // Generated PDF
      });
      this.closebutton.nativeElement.click();
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.patientRegService.upload(file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.filePath = event.link;
          this.loader = false;
        }
      }
    );
  }
  uploadNationalIDFile(event: any) {
    this.loader = true;
    this.nationalIDSelectedFiles = [];
    for (var i = 0; i < event.target.files.length; i++) {
      var type = event.target.files[i].name.split(".").pop();
      if (event.target.files[i].size > 5242880) {
        this.fileError = 'File size limit should not exceed 5MB';
        //this.toastr.warning( this.fileError, "Warning");
      } else if (type.toLowerCase() !== 'pdf' && type.toLowerCase() !== 'jpeg' && type.toLowerCase() !== 'jpg' && type.toLowerCase() !== 'bmp' && type.toLowerCase() !== 'gif' && type.toLowerCase() !== 'png' && type.toLowerCase() !== 'tiff' && type.toLowerCase() !== 'tif') {

        this.fileError = 'File type should be pdf, jpeg, jpg, bmp, gif, png, tiff';
        //this.toastr.warning(this.fileError, "Warning");
      } else {
        this.nationalIDFileName = event.target.files[i].name;
        this.nationalIDSelectedFiles.push(event.target.files[i]);
        this.showNationalIDFile = true;
        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          var formData = new FormData();
          var actionData = {
            userID: sessionStorage.getItem("userId"),
            file: event.target.files[0],
          };
          formData.append("userID", "1");
          formData.append("file", actionData.file);
          formData.append("screenName", "Patient Registration");
          formData.append("fieldName", "National ID/Passport");
          this.patientRegService.patientPhotoUpload(formData).subscribe({
            next: (result) => {
              if (result.item1 != null) {
                this.nationalIDFileName = result.item1;
                //this.toastr.success("File uploaded successfully", "Success");
                //this.ngxService.stop();
                this.loader = false;
                this.patientRegForm.get('nationalIDFile')?.setValue(this.nationalIDFileName);
              }
              //this.ngxService.stop();
              this.loader = false;
            },
            error: (error) => {
              //this.ngxService.stop();
              this.loader = false;
              //this.toastr.error("Something went wrong", "Error");
              console.log(error);
            },
          });
        }
      }
    }
  }
  downloadFile(fileName: any) {
    this.patientRegService.fileDownload(fileName);
  }
  redirectToOPBillpage() {
    if (this.patientID != "") {
      this.router.navigate(['/opbilling']);
    }
    else {
      this.openNoRecFound();
    }
  }
  yesNoDialog() {
    this.dialog
      .confirmDialog({
        title: 'Are you sure?',
        message: 'Are you sure you want to do this?',
        confirmCaption: 'Yes',
        cancelCaption: 'No',
        dialogType: "confirm"
      })
      .subscribe((yes) => {
        if (yes) console.log('The user said YES');
      });
  }

  confirmCancelDialog() {
    this.dialog
      .confirmDialog({
        title: 'Confirm Action',
        message: 'Do you want to confirm this action?',
        confirmCaption: 'Confirm',
        cancelCaption: 'Cancel',
        dialogType: "confirm"
      })
      .subscribe((confirmed) => {
        if (confirmed) console.log('The user confirmed the action');
      });
  }

  openDialogTable() {
    this.dialog
      .confirmDialog({
        title: 'Confirm Action',
        message: 'Do you want to confirm this action?',
        confirmCaption: 'Confirm',
        cancelCaption: 'Cancel',
        dialogType: "table"
      })
      .subscribe((confirmed) => {
        if (confirmed) console.log('The user confirmed the action');
      });
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var type = event.target.files[0].name.split(".").pop();
      if (event.target.files[0].size > 5242880) {
        this.fileError = 'File size limit should not exceed 5MB';
        alert(this.fileError);
      }
      else if (type.toLowerCase() !== 'jpeg' && type.toLowerCase() !== 'jpg' && type.toLowerCase() !== 'bmp'
        && type.toLowerCase() !== 'gif' && type.toLowerCase() !== 'png' && type.toLowerCase() !== 'tiff' && type.toLowerCase() !== 'tif') {
        this.fileError = 'File type should be  jpeg, jpg, bmp, gif, png, tiff';
        alert(this.fileError);
      }
      else {
        const target = event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        this.convertToBase64(file, event.target.id);
      }
    }
  }
  convertToBase64(file: File, inputType: any) {
    if (inputType == "nationalId") {
      const observable = new Observable((subscriber: Subscriber<any>) => {
        this.readFile(file, subscriber);
      })
      observable.subscribe((d) => {
        this.nationalIdPhoto = d;
        this.natioanalIdUploaded = true;
      })
    }
    else {
      const observable = new Observable((subscriber: Subscriber<any>) => {
        this.readFile(file, subscriber);
      })
      observable.subscribe((d) => {
        // console.log(d);
        this.myPhoto = d;
        this.profilePhotoUploaded = true;
      })
    }
  }
  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    }
    filereader.onerror = () => {
      subscriber.error();
      subscriber.complete();
    }
  }
  openEmployeeDetailsmodal() {
    this.displayEmployeeDetailsmodal = "block";
  }
  closeEmployeeDetailsPopup() {
    this.displayEmployeeDetailsmodal = "none";
    this.employeeDetails = [];
    this.IsEmployeeDetailsForm.get('empNo')?.setValue('');
    this.IsEmployeeDetailsForm.get('empName')?.setValue('');
  }
  getPatientInfoByYakeenService() {
    this.loader = true;
    if (this.patientRegForm.get('DOB')?.value != "" && this.patientRegForm.get('SSN')?.value != "") {
      var dob = this.datepipe.transform(this.patientRegForm.get('DOB')?.value, "dd-MMM-yyyy")?.toString();
      var nationalId = this.patientRegForm.get('SSN')?.value;
      this.patientRegService.fetchPatientInfoByYakeenService(nationalId, dob).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {
          console.log(response);
          this.patientInfoByYakeenService = response.Users;
          this.iqamaExpiryDate = response.Users[0].IqamaExpiryDateG;
          this.hijriDate = response.Users[0].DateOfBirth;
          this.patientRegForm.patchValue({
            FirstName: response.Users[0].EnFirstName,
            Familyname: response.Users[0].EnLastName,
            FirstName2L: response.Users[0].FirstName,
            Familyname2L: response.Users[0].LastName
          })
          if (response.Users[0].EnSecondName != "" && response.Users[0].EnSecondName != "-") {
            this.patientRegForm.patchValue({
              MiddleName: response.Users[0].EnSecondName,
              MiddleName2L: response.Users[0].SecondName
            })
          }
          else if (response.Users[0].EnThirdName != "" && response.Users[0].EnThirdName != "-") {
            this.patientRegForm.patchValue({
              MiddleName: response.Users[0].EnThirdName,
              MiddleName2L: response.Users[0].ThirdName
            })
          }
          this.dateChanged = false;
          var date = response.Users[0].DateOfBirth;
          let reqDate = {
            "HDOB": date
          }
          this.patientRegService.getEnglishDate(reqDate).subscribe((response) => {
            console.log(response.SmartDataList[0].Age);
            this.patientRegForm.patchValue({
              //DOB: response.SmartDataList[0].EnglishDate,
              DOB: moment(response.SmartDataList[0].EnglishDate).format('yyyy-MM-DD'),
              Age: response.SmartDataList[0].Age
            })
          });
          this.loader = false;
        }
        else {
          this.loader = false;
          this.displayYakeenNoDataModal = "block";
        }
      });
    }
    else {
      this.loader = false;
      this.displayYakeenInfoModal = "block";
    }
  }
  closeYakeenInfoModalpopup() {
    this.displayYakeenInfoModal = "none";
  }
  closeYakeenNodataModalpopup() {
    this.displayYakeenNoDataModal = "none";
  }
}
