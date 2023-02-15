import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompaniesList, IcompanyInfo } from 'src/app/shared/Models/companies-list';
import { ContractmanagementService } from '../services/Contract-Management.service';

@Component({
  selector: 'app-company-configuration',
  templateUrl: './company-configuration.component.html',
  styleUrls: ['./company-configuration.component.scss']
})
export class CompanyConfigurationComponent implements OnInit {

  companyName!: string;
  companiesList: CompaniesList[] = [];
  CompanyId!: number;
  companyInfo!: IcompanyInfo;
  companyDetails!: FormGroup;
  submitted: boolean = false;

  constructor(
    public service: ContractmanagementService,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.companyDetails = this.fb.group({
      contractDate: new FormControl('', Validators.required),
      validFrom: new FormControl('', Validators.required),
      validTo: new FormControl('', Validators.required),
      cardLimit: new FormControl('', Validators.required),
      creditBalence: new FormControl('', Validators.required),
      vatNumber: new FormControl('', Validators.required),
      approvalNotApplicable: new FormControl(''),
      UAF: new FormControl(''),
      approvalRequired: new FormControl('', Validators.required),
      policyNumber: new FormControl('', Validators.required),
      basicRules: new FormControl('', Validators.required),

      invoiceProcessDetails: this.fb.group({
        insurence: new FormControl('', Validators.required),
        selfInsurence: new FormControl(''),
        TPA: new FormControl('', Validators.required),
        selfTPA: new FormControl(''),
        template: new FormControl('', Validators.required),
        discountOnCashForOP: new FormControl(''),
        discountOnCashForIP: new FormControl('', Validators.required),
        noOfOpPatientsDay: new FormControl('', Validators.required),
        noOfIpPatientsDay: new FormControl('', Validators.required),
        consultationPerPatientPerDay: new FormControl('', Validators.required),
        fixedConsultationCharges: new FormControl('', Validators.required),
        invoicesDirect: new FormControl('', Validators.required),
        coveringLetterDirect: new FormControl('', Validators.required),
        summaryDetailsDirect: new FormControl('', Validators.required),
      }),

      paymentDetails: this.fb.group({
        paymentDueDate1: new FormControl('', Validators.required),
        paymentDueDate2: new FormControl('', Validators.required),
        paymentDueDate3: new FormControl('', Validators.required)
      })
    });
  }

  get invoiceProcessDetailsData() {
    return this.companyDetails.get('invoiceProcessDetails') as FormGroup;
  }

  get paymentDetailsData() {
    return this.companyDetails.get('paymentDetails') as FormGroup;
  }

  searchBycompany() {
    if (this.companyName.length >= 3) {
      this.service.getCompaniesList(this.companyName).subscribe((res: CompaniesList[]) => {
        if (res) {
          this.companiesList = res;
        }
      })
    }
  }
  setValue($event: any) {
    this.CompanyId = $event.target.value;
    this.companiesList = this.companiesList.filter((x: any) => {
      if (x.CompanyId == this.CompanyId) {
        this.companyName = x.CompanyName;
        this.service.getSingleCompanyData(+this.CompanyId).subscribe((resData: IcompanyInfo) => {
          if (resData) {
            this.companyInfo = resData;
          }
        });
      }
    })
  }

  saveCompanyDetails() {
    if (this.companyDetails.invalid) {
      this.submitted = true;
      this.companyDetails.markAsPristine();
    } else {
      console.log(this.companyDetails.value, 'check here');
    }

  }
}
