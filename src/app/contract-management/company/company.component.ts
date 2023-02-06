import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContractmanagementService } from '../services/Contract-Management.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
  companyForm!: FormGroup;
  CompanyTypes: any;

  constructor(
    public fb: FormBuilder,
    public service: ContractmanagementService
  ) { }

  ngOnInit(): void {
    this.loadCompanyMasterForm();
    this.loadCompanyTypes();
  }

  loadCompanyMasterForm(): void {
    this.companyForm = this.fb.group({
      fmCompanyCreditDays: new FormControl(''),
      fmCompanyLicenseNo: new FormControl(''),
      fmCompanyEmail: new FormControl(''),
      fmCompanyFax: new FormControl(''),
      fmCompanyMobile: new FormControl(''),
      fmCompanyPhone: new FormControl(''),
      fmCompanyCountry: new FormControl(''),
      fmCompanyPinCode: new FormControl(''),
      fmCompanyState: new FormControl(''),
      fmCompanyCity: new FormControl(''),
      fmCompanyAddress1: new FormControl(''),
      fmCompanyAddress: new FormControl(''),
      fmCompanyName: new FormControl(''),
      fmCompanyType: new FormControl(''),
      fmCompanyCode: new FormControl(''),
    });
  }


  onCountryChange(event: any) {
    var Country = this.companyForm.get('fmCompanyCountry')?.value;
    //this.patientRegForm.get('CountryName')?.setValue(event.target.options[event.target.options.selectedIndex].text);
    // this.patientRegService.fetchCity(Country).subscribe((response) => {
    //   if (response.Status == 'Success' && response.Code == 200) {
    //     this.Cities = response.SmartDataList;
    //   }
    // });
  }

  onCityChange(event: any) {
    //this.companyForm.get('fmCompanyCity')?.setValue(event.target.options[event.target.options.selectedIndex].text);
  }

  saveCompany() {

  }

  loadCompanyTypes() {
    this.CompanyTypes = this.service.getCompanyTypes();
  }


}
