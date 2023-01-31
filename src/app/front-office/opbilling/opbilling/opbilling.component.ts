import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { Patterns } from 'src/global-constants';
import { map, Observable, startWith } from 'rxjs';
import { __values } from 'tslib';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS,  MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import { DatePipe } from '@angular/common';
import { OpbillingService } from '../services/opbilling.service';
import { ConsultantDetails, OutPatientBill, OutPatientTemp, PaymentDetails, SaveBill, SummaryTable } from '../models/opbilling.model';
import { PatientRegistrationService } from '../../patient-registration/services/patient-registration.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-opbilling',
  templateUrl: './opbilling.component.html',
  styleUrls: ['./opbilling.component.scss']
})
export class OPBillingComponent implements OnInit {
  loader: boolean = false;
  lang: string = "";
  fetchingSerchValue: any;
  isFetchPatientdata: boolean = false;
  patientID: string = "";
  regCode: string = "";
  patientName: string = "";
  nationality: string = "";
  nationalId: string = "";
  mobileNo: string = "";
  age: string = "";
  gender: string = "";
  maritalStatus: string = "";
  opBillingform !: FormGroup;
  Services: any;
  selectedServiceID: string = "";
  serviceTypeList:any;
  serviceId: string = "";
  displayInfoModal: string = "none";
  displayCreditCardInfo: string = "block";
  servicesTypeNameList: any;
  noDataMessage: string = "Invalid Patient File";
  billAmount: string = "";
  payerAmount: string = "";
  VAT: string = "";
  discountAmount: string = "";
  depositAmount: string = "";
  refundAmount: string = "";
  OPBillingTempList: OutPatientTemp[] = new Array<OutPatientTemp>();
  consultantDetails: ConsultantDetails[]=[];
  saveBill:SaveBill=new SaveBill();
  summaryTableList:SummaryTable[]=new Array<SummaryTable>();
  paymentDetailsList: PaymentDetails[] = [];
  generatedBillId: any;
  generatedToken: any;
  billSummary: any;
  ipAddress: any;
  sessionId: string ="";
  displayStyle: string = "none";
  displayErrModal: string = "none";
  reqToGetPatientData: any;
  isFormSubmitted: boolean = false;
  displayNoPatientDataModal: string = "none";
  CreditCardText: string = "Credit Card Info";
  //numWords = require('num-words');
  initializeForm() {
    this.opBillingform = this.fb.group({
      ServiceID: ['', Validators.required],
      ServiceTypeID: ['', Validators.required],
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
      PassportNo: [''],
      Isvip: [false],
      IsEmployee: [false],
      Email: ['', Validators.pattern(Patterns.PAT_EMAIL)],
      ContactName: ['', Validators.required],
      ContRelationID: ['', Validators.required],
      ContRelation: [],
      Address01: ['', Validators.required],
      CityID: ['', Validators.required],
      City: [],
      state: [''],
      country: [''],
      CountryName: [''],
      CityAreaID: [''],
      Area: [''],
      nationalIDFile:[''],
    });
  }
  constructor(
    private opbillingService: OpbillingService, private http: HttpClient,
    private router: Router, private fb: FormBuilder, private patientRegService: PatientRegistrationService,
    ) { }

  ngOnInit(): void {
    this.lang = sessionStorage.getItem("language")!;
    this.patientID = sessionStorage.getItem("patientID")!;
    this.regCode = sessionStorage.getItem("regCode")!;
    this.initializeForm();
    this.GetServices();
    this.selectModeOfPayment(1);
    this.ValidateRegCode();
    //this.getPatientData(this.patientID);    
    this.getIPAddress();
    this.sessionId = Guid.create().toString(); //"1234567890ABCDEF"; //`${this.ipAddress}."3038"`;
    
    this.patientRegService.getPatientID().subscribe((data: any) => {
      console.log(data);
      this.reqToGetPatientData = data;
      if (this.reqToGetPatientData != ("" && null)) {
        this.getPatientData(this.reqToGetPatientData.PatientID);
      } else {
        this.clearScreen();
      }
    });

    this.patientRegService.getFetchPatientData().subscribe((data: any) => {
      this.fetchingSerchValue = data;
    })
    this.patientRegService.getIsFetchPatientData().subscribe((data: any) => {
      if (data == false && this.isFetchPatientdata) {
        this.clearScreen();
      }
    });
  }
  ValidateRegCode() {
    if(this.regCode != "" && this.regCode != null) {
      this.opbillingService.validateRegCode(this.regCode).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {      
          this.getPatientData(this.patientID);
        }
        else {
          this.displayInfoModal = "block"; 
          this.noDataMessage = response.SmartDataList.Message;
        }
      },
      (err) => {
        this.loader = false;
        console.log(err);
      });
    }
  }
  getPatientData(patientID: any) {
    this.loader = true;    
    this.opbillingService.fetchPatientData(patientID).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200 && response.PatientData.length > 0) {      
        this.patientID = response.PatientData[0].PatientID;
        this.regCode = response.PatientData[0].RegCode;
        if(this.lang == 'ar') { 
          this.patientName =  response.PatientData[0].FirstName2l + " " + response.PatientData[0].MiddleName2l + " "+  response.PatientData[0].Familyname2l ;
          this.age = response.PatientData[0].Age + " " + response.PatientData[0].AgeType2l; 
          this.gender = response.PatientData[0].Gender2l;
          this.maritalStatus = response.PatientData[0].MarStatus2l;
          this.nationality = response.PatientData[0].Nationality2l;
        }
        else { 
          this.patientName =  response.PatientData[0].FirstName+ " " + response.PatientData[0].MiddleName+ " "+  response.PatientData[0].Familyname;
          this.age = response.PatientData[0].Age + " " + response.PatientData[0].AgeType; 
          this.gender = response.PatientData[0].Gender;
          this.maritalStatus = response.PatientData[0].MarStatus;
          this.nationality = response.PatientData[0].Nationality;
        }        
        this.nationalId = response.PatientData[0].SSN;
        this.mobileNo = response.PatientData[0].MobileNo;
        this.loader = false;
      }
      else {
        this.loader = false;
      }
    },
    (err) => {
      this.loader = false;
      console.log(err);
    });
  }
  navigateToRegistration() {
    this.router.navigate(['/patient-registration']).then(() => {
      window.location.reload();
    }); 
  }
  GetServices() {
    this.opbillingService.getAllServices().subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {      
          this.Services = response.SmartDataList;
      }
    },
    (err) => {
      this.loader = false;
      console.log(err);
    });
  }
  onServiceChange(event: any) {
    this.selectedServiceID = this.opBillingform.get('ServiceID')?.value;

  }
  selectModeOfPayment(selectedValue: any) {
    if(selectedValue == "4") {
      this.CreditCardText = "Debit Card Info";
    }
    if(selectedValue == "1") {
      this.displayCreditCardInfo = "none";
    }
    else {
      this.displayCreditCardInfo = "block";
    }
  }
  searchServiceType(event: any) {
    if(event.target.value.length > 2) {
      var serviceType = event.target.value;
      this.opbillingService.fetchConsultants(this.selectedServiceID, serviceType).subscribe((response) => {
        if (response.Status == 'Success' && response.Code == 200) {      
            this.serviceTypeList = response.SmartDataList;
        }
      },
      (err) => {
        this.loader = false;
        console.log(err);
      });
    }
  }
  onSelectServiceType(serviceType: any) {
    //console.log("serviceType is " +serviceType)
    this.loader = true;
    var serviceId = this.opBillingform.get('ServiceID')?.value;
    var serviceTypeId = serviceType.ConsultantID.split('-')[0];
    var VisitType = serviceType.ConsultantID.split('-')[2];
    var SpecialisationId = serviceType.ConsultantID.split('-')[1];
    this.opbillingService.FetchServicePrice(serviceId, serviceTypeId, -1, VisitType, SpecialisationId, -1).subscribe((response) => {
      if (response.Status == 'Success' && response.Code == 200) {  
        this.loader = false;
        if(this.servicesTypeNameList == undefined || this.servicesTypeNameList.length == 0) {    
          this.servicesTypeNameList = response.PatientIDRegCode;          
        }
        else {
          this.servicesTypeNameList.push(response.PatientIDRegCode[0]);
        }
        this.FillConsultationDetails(response.PatientIDRegCode[0]);
      }
    },
    (err) => {
      this.loader = false;
      console.log(err);
    });
  }
  FillConsultationDetails(element: any) {
    let consultantDetails=new ConsultantDetails();
      consultantDetails.code="027";//element.code;
      consultantDetails.departmentName=element.DeptName;
      consultantDetails.empId=element.empId;
      consultantDetails.hospDeptId=element.DeptID;//element.hospDeptId;
      consultantDetails.name=element.Procedure;
      consultantDetails.orderType=element.orderType;
      consultantDetails.orderTypeId=element.OrderTypeID;
      consultantDetails.patientType=1;
      consultantDetails.procedureId=element.ItemId;
      consultantDetails.service=element.ServiceName;
      consultantDetails.serviceTypeId=element.serviceTypeId;
      consultantDetails.specialiseId=element.SpecialiseID;
      consultantDetails.quantity=1;
      consultantDetails.specialisation=element.Specialisation;
      consultantDetails.serviceId=element.ServiceId;
      consultantDetails.price= element.BillablePrice;
      this.consultantDetails.push(consultantDetails);
      this.OPTempDetails();
  }
  OPTempDetails() {
    this.loader = true;
    let billing=new OutPatientBill();
    this.OPBillingTempList = new Array<OutPatientTemp>();
    this.consultantDetails.forEach( it => {
      let temp=new OutPatientTemp();
      temp.serviceName=it.service;
      temp.serviceId=it.serviceId;
      temp.procedure=it.code+'-'+it.name;
      temp.procedureId=it.procedureId;
      temp.procId=it.procedureId;
      temp.sample=it.orderType;
      temp.sampleId=it.orderTypeId==undefined?it.sampleId:it.orderTypeId;
      temp.deptId=it.hospDeptId==undefined?it.deptId:it.hospDeptId
      temp.deptName=it.departmentName;
      temp.bedTypeId=-1;
      temp.bedTypeName='OPD';
      temp.specialiseId=it.specialiseId;
      temp.specialiseName=it.specialisation;
      temp.isGroup=false;
      temp.quantity=it.quantity;
      temp.amount=0;
      temp.profileId=0;
      temp.MQTY=it.quantity;
      temp.SQTY=0;
      temp.status=0;
      temp.basePrice=it.price;
      temp.billablePrice=it.price;
      temp.eligiblePrice=it.price;
      temp.price=it.price;
      temp.serviceTypeID=it.serviceTypeId;
      temp.patientType=1;
      temp.priority=13,
      temp.tariffId=-1;
      this.OPBillingTempList.push(temp);
    })
    billing.UHID=this.regCode;
    billing.BillType="Cash";
    billing.CompanyID=0;
    billing.GradeID=0;
    billing.GradeSpecialiseID=0;//this.OPBillingTempList[0].specialiseId;
    billing.PatientID=this.patientID;
    billing.PatientType=1;//this.OPBillingTempList[0].patientType;
    billing.LocationID=1;
    billing.WorkstationID=3392;
   // billing.SpID=this.OPBillingTempList[0].specialiseId;
    billing.DoctordID= 0;
    billing.GradeName= "";
    billing.outPatientTempDetails=this.OPBillingTempList;
    billing.ScanDocumentPath="";
    billing.NationalIDPath="";
    billing.SessionID=this.sessionId;
    billing.SelectedService=this.selectedServiceID;
    //if(this.saveDiscountsList.length>0){
    //billing.discountList=  this.saveDiscountsList;
    //billing.availDiscounts=true;
    //this.saveBill.availDiscounts=true;
    //}
    billing.isAvailDeposit= false;//this.paymentForm.get('availDeposit').value;
    this.opbillingService.getPayment(billing).subscribe({
      next: (data) => {
        console.log(data);
        if(data.validationMessage=="Success"){
        this.billSummary=data.dtBillSummary;
        this.billAmount = this.billSummary[0]['amount'];
        this.payerAmount = data.dtBillSummary[1]["amount"];
        this.VAT = data.dtBillSummary[3]["amount"];
        this.discountAmount = data.dtBillSummary[2]["amount"];
        this.depositAmount = data.dtBillSummary[4]["amount"];
        this.refundAmount = data.dtBillSummary[5]["amount"];
        this.saveBill.creditBillDetails=data.dtCreditBillDetails;
        this.saveBill.creditBillContributions=data.dtCreditBillContribution;
        this.saveBill.discountDetails=data.dtDiscountDetails;
        this.saveBill.billPackageItems=data.dtCompanyBillPackageItemDetails;
        this.saveBill.billDetails=data.dtBillDetails;
        this.saveBill.letterID=data.letterID;
        this.saveBill.saveDefaultLOA=data.isDefaultLOA;
        this.saveBill.parrentLetterID=data.parentLetterId;
        this.saveBill.billSummary= data.dtBillSummary;
        this.saveBill.collectableType=data.collectableType;
        this.saveBill.cpayAfterVAT=data.cpayAfterVAT;
        this.saveBill.ppayAfterVAT=data.ppayAfterVAT;
        this.saveBill.maxCollectable=data.maxCollectable;
        this.saveBill.vatAmount=data.vatAmount;
        this.saveBill.pvatValue=data.pvatValue;
        this.saveBill.cvatValue=data.cvatValue;
        this.saveBill.discountData=data.dtDiscountData;
        this.saveBill.availDeposit=0;
        //this.saveBill.creditBillDetails[0].depositAmount;
        //this.paymentForm.get('depositAmount').setValue(this.saveBill.creditBillDetails[0].depositAmount);
        //this.paymentForm.get('amount').setValue( this.saveBill.billSummary.filter(it=>it.description=='Balance Amount')[0].amount);
        //this.btnSaveDisabled=false;
        
      }
        else {}
        //this.toastr.warning(this.ts.instant(data.validationMessage), this.ts.instant("Warning"));
        //this.ngxService.stopLoader('billing');
        this.loader = false;
      },
      error: (error) => {
        //this.ngxService.stopLoader('billing');
        //this.toastr.error(this.ts.instant(error), this.ts.instant("Error"));
      },
      complete: () => {},
    });
  }
  saveBillDetails() {
    //this.ngxService.startLoader('billing');
    this.loader = true;
    this.isFormSubmitted = true;
    if(!this.patientID) {
      this.openNoRecFound();
      this.loader = false;
    }
    var servid = this.opBillingform.get('ServiceID')?.value;
    var servtypeid = this.opBillingform.get('ServiceTypeID')?.value;
    if(servid && servtypeid) {
    this.OPBillingTempList = new Array<OutPatientTemp>();
    this.consultantDetails.forEach( it => {
      let temp=new OutPatientTemp();
      temp.serviceName=it.service;
      temp.serviceId=it.serviceId;
      temp.procedure=it.code+'-'+it.name;
      temp.procedureId=it.procedureId;
      temp.sample=it.orderType;
      temp.sampleId=it.orderTypeId==undefined?it.sampleId:it.orderTypeId;
      temp.deptId=it.hospDeptId==undefined?it.deptId:it.hospDeptId
      temp.deptName=it.departmentName;
      temp.bedTypeId=-1;
      temp.bedTypeName='OPD';
      temp.specialiseId=it.specialiseId;
      temp.specialiseName=it.specialisation;
      temp.isGroup=false;
      temp.quantity=it.quantity;
      temp.amount=0;
      temp.profileId=0;
      temp.MQTY=it.quantity;
      temp.SQTY=0;
      temp.status=0;
      temp.basePrice=it.price;
      temp.billablePrice=it.price;
      temp.eligiblePrice=it.price;
      temp.price=it.price;
      temp.serviceTypeID=it.serviceTypeId;
      temp.patientType=1;
      temp.priority=1;//this.billingForm.get('billType').value=="Cash"?13:1,
      temp.tariffId=-1;//this.tariffID;
      this.OPBillingTempList.push(temp);
    })
    this.saveBill.UHID=this.regCode;
    this.saveBill.BillType="Cash";
    // if(this.billingForm.get('billType').value=="Credit"){
    // this.saveBill.CompanyID=this.billingForm.get('companyID').value;
    // this.saveBill.GradeID=this.billingForm.get('gradeID').value;
    // }
    this.saveBill.GradeSpecialiseID=0;//this.billingForm.get('refDoctorSpecialiseID').value; //this.OPBillingTempList[0].specialiseId;
    this.saveBill.PatientID=this.patientID;
    this.saveBill.PatientType=1;
    this.saveBill.LocationID=3;//this.locationId;
    this.saveBill.WorkstationID=3392;//this.workstationId;
    this.saveBill.DoctordID=0;//this.billingForm.get('refDoctorID').value;// this.consultantDetails[0].empId;
    this.saveBill.GradeName= "";//this.billingForm.get('gradeName').value;
    this.saveBill.outPatientTempDetails=this.OPBillingTempList;
    this.saveBill.SessionID=this.sessionId;
    this.saveBill.TariffID=-1;//this.tariffID;
    this.saveBill.DoctorID= 0;// this.billingForm.get('refDoctorID').value;//this.consultantDetails[0].empId;
    this.summaryTableList = new Array<SummaryTable>();
    let summaryTable=new SummaryTable();
    summaryTable.modeId=1;
    summaryTable.bankID=0;
    summaryTable.cardTypeID=0;
    summaryTable.voucherNameID=0;
    summaryTable.amount=this.billAmount;//this.paymentForm.get('amount').value;
    summaryTable.modeOfPayment='Cash';
    summaryTable.referenceNo='';
    summaryTable.voucherName='';
    summaryTable.EDCMachine='';
    summaryTable.number='';
    summaryTable.approvalNo='';
    summaryTable.TDate='01-Jan-1900';
    summaryTable.validity='01-Jan-1900';
    if(this.paymentDetailsList?.length>0){
      this.paymentDetailsList.forEach( it => {
      let summaryTable=new SummaryTable();
      summaryTable.modeId=it.PMID
      summaryTable.bankID=it.BID
      summaryTable.cardTypeID=it.CID
      summaryTable.voucherNameID=it.VID
      summaryTable.amount=it.AMT
      summaryTable.modeOfPayment=it.ModeofPayment
      summaryTable.referenceNo='';
      summaryTable.voucherName=it.VNAME
      summaryTable.EDCMachine=it.EDCM
      summaryTable.number=it.CNO
      summaryTable.approvalNo=it.TNO
      summaryTable.TDate=it.TDATE
      summaryTable.validity=it.VTO
      summaryTable.cardHolderName=it.CHOL
      summaryTable.cardTypeID=it.CID
      this.summaryTableList.push(summaryTable);
      });
    }
    else
    this.summaryTableList.push(summaryTable);
    this.saveBill.summaryTableDetails=this.summaryTableList;
    this.saveBill.actualAmount=this.billAmount;//this.paymentForm.get('amount').value;
    this.saveBill.discountID=0;//this.discountId;
    this.saveBill.isAvailDeposit= false;// this.paymentForm.get('availDeposit').value;
    this.saveBill.discountLevel="";//this.discountLevel;
    this.opbillingService.saveBill(this.saveBill).subscribe({
      next: (data) => {
        console.log(data);
        this.generatedBillId = data.item1;
        this.generatedToken = data.item3;
        if(data.item2=="Success") {
          //this.toastr.success(this.ts.instant('Bill Generated Successfully'), this.ts.instant("Success"));
          //alert("Bill Generated");
          this.displayStyle = "block";
          this.loader = false;
        }
        else{
          this.displayErrModal = "block"; 
        }
        //this.toastr.warning(this.ts.instant('Error'), this.ts.instant("Warning"));
        //this.ngxService.stopLoader('billing');
      },
      error: (error) => {
        //this.ngxService.stopLoader('billing');
        //this.toastr.error(this.ts.instant(error), this.ts.instant("Error"));
      },
      complete: () => {},
    });
  }
  else {
    this.loader = false;
  }
  }
  closeInfoModalpopup() {
    this.displayInfoModal = "none";
  }

  removeItem(i: any){
    this.servicesTypeNameList.splice(i, 1);
  }
  fetchIPAddress() {
    return this.getIPAddress().subscribe((response) => {
      this.ipAddress = response.ip;
    });
  }
  getIPAddress():Observable<any>{
    return this.http.get<{ip:string}>('https://api.ipify.org/?format=json').pipe(map(res => res));
  }
  closePopup() {
    this.displayStyle = "none";
    this.clearScreen();
  }
  closeErrorPopup() {
    this.displayErrModal = "none"; 
  }
  clearScreen() {
    this.opBillingform.reset();
    this.opBillingform.markAsPristine()
    this.opBillingform.markAsUntouched()
    //this.opBillingform.get('ServiceID')?.setErrors('')
    this.opBillingform.get('ServiceID')?.setValue('');
    this.opBillingform.get('ServiceTypeID')?.setErrors(null)
    this.opBillingform.get('Title ')?.setErrors(null)
    this.opBillingform.get('NationalityID')?.setErrors(null)
    this.opBillingform.get('Nationality ')?.setErrors(null)
    this.opBillingform.get('GenderID')?.setErrors(null)
    this.opBillingform.get('Gender ')?.setErrors(null)
    this.opBillingform.get('MaritalStatusID')?.setErrors(null)
    this.opBillingform.get('MaritalStatus ')?.setErrors(null)
    this.opBillingform.get('ReligionID')?.setErrors(null)
    this.opBillingform.get('Religion ')?.setErrors(null)
    this.opBillingform.get('AgeUOMID')?.setErrors(null)
    this.opBillingform.get('Familyname')?.setErrors(null)
    this.opBillingform.get('MiddleName')?.setErrors(null)
    this.opBillingform.get('FirstName')?.setErrors(null)
    this.opBillingform.get('DOB')?.setErrors(null)
    this.opBillingform.get('GrandFatherName')?.setErrors(null)
    this.opBillingform.get('Familyname2L')?.setErrors(null)
    this.opBillingform.get('MiddleName2L')?.setErrors(null)
    this.opBillingform.get('FirstName2L')?.setErrors(null)
    this.opBillingform.get('GrandFatherName2L')?.setErrors(null)
    this.opBillingform.get('Age')?.setErrors(null)
    this.opBillingform.get('PassportNo')?.setErrors(null)
    this.opBillingform.get('Isvip')?.setErrors(null)
    this.opBillingform.get('IsEmployee')?.setErrors(null)
    this.opBillingform.get('Email')?.setErrors(null)
    this.opBillingform.get('ContactName')?.setErrors(null)
    this.opBillingform.get('ContRelationID')?.setErrors(null)
    this.opBillingform.get('ContRelation ')?.setErrors(null)
    this.opBillingform.get('Address01')?.setErrors(null)
    this.opBillingform.get('CityID')?.setErrors(null)
    this.opBillingform.get('City ')?.setErrors(null)
    this.opBillingform.get('state')?.setErrors(null)
    this.opBillingform.get('country')?.setErrors(null)
    this.opBillingform.get('CountryName')?.setErrors(null)
    this.opBillingform.get('CityAreaID')?.setErrors(null)
    this.opBillingform.get('Area')?.setErrors(null)
    this.opBillingform.get('nationalIDFile')?.setErrors(null)
    this.patientName = "";
    this.age = ""; 
    this.gender = "";
    this.maritalStatus = "";
    this.nationality = "";  
    this.nationalId = "";
    this.mobileNo = ""; 
    sessionStorage.setItem("patientID", '');
    sessionStorage.setItem("regCode", '');
    this.patientID = "";
    this.regCode = "";
    this.sessionId = Guid.create().toString();
    this.consultantDetails = [];
    this.billAmount = "";
    this.VAT = "";
    this.servicesTypeNameList = [];
    this.serviceTypeList = [];
  }
  openNoRecFound() {
    this.displayNoPatientDataModal = "block";
  }
  closeNoRecFound() {
    this.displayNoPatientDataModal = "none";
  }
}
