import { Component, OnInit } from '@angular/core';
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

  constructor(
    public service: ContractmanagementService
  ) { }

  ngOnInit(): void {

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
}
