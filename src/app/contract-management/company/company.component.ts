import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContractmanagementService } from '../services/contractmanagement.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  CompanyTypes:any;
  Countries: any;
  Cities: any;
  
  companyForm!: FormGroup;
  constructor(private formBuilder:FormBuilder, private contractService:ContractmanagementService) { }

  ngOnInit(): void {
    this.loadCompanyMasterForm();
    this.loadCompanyTypes();    
  }

  loadCompanyMasterForm():void{
this.companyForm=this.formBuilder.group({
  fmCompanyCreditDays:'',
  fmCompanyLicenseNo:'',
  fmCompanyEmail:'',
  fmCompanyFax:'',
  fmCompanyMobile:'',
  fmCompanyPhone:'',
  fmCompanyCountry:'',
  fmCompanyPinCode:'',
  fmCompanyState:'',
  fmCompanyCity:'',
  fmCompanyAddress1:'',
  fmCompanyAddress:'',
  fmCompanyName:'',
  fmCompanyType:'',
  fmCompanyCode:'',

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

  saveCompany()
  {

  }

  loadCompanyTypes()
  {
      this.CompanyTypes=this.contractService.getCompanyTypes();
  }
}
