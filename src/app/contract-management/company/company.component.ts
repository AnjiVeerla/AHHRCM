import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AutoSeatchComponent } from 'src/app/shared/auto-seatch/auto-seatch.component';
import { ContractmanagementService } from '../services/Contract-Management.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
  @ViewChild("tref") tref!: AutoSeatchComponent;

  companyForm!: FormGroup;
  CompanyTypes: any;

  bsModalRef!: BsModalRef;
  filterDataList: any[] = [];
  subscription!: Subscription;

  constructor(
    public fb: FormBuilder,
    public service: ContractmanagementService,
    public modalService: BsModalService
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

    this.service.getListData().subscribe((res: any) => {
      if (res) {
        this.filterDataList = res;
      }
    })
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

  getSearchData() {
    this.tref.show();
  }
}
