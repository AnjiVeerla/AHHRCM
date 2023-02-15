import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContractmanagementService } from 'src/app/contract-management/services/Contract-Management.service';
import { searchData } from '../Models/companies-list';

@Component({
  selector: 'app-auto-seatch',
  templateUrl: './auto-seatch.component.html',
  styleUrls: ['./auto-seatch.component.scss']
})
export class AutoSeatchComponent implements OnInit {
  @ViewChild("lgModalChild") lgModalChild: any;
  searchForm!: FormGroup
  finalData!: searchData[];
  searchTableData: boolean = false;
  selectedFinalDataList: any[] = [];
  tableData: any[] = [];
  filterData: any[] = [];
  filterDataType: boolean = false;

  constructor(
    public fb: FormBuilder,
    public service: ContractmanagementService) { }

  ngOnInit(): void {
    this.filterData = [];
    this.searchForm = this.fb.group({
      searchType1: new FormControl(''),
      searchType2: new FormControl(''),
      searchType3: new FormControl(''),
      searchString1: new FormControl(''),
      searchString2: new FormControl(''),
      searchString3: new FormControl(''),
    });

    this.tableData = [
      { id: 1, name: 'sample1', value: 'value1' },
      { id: 2, name: 'sample2', value: 'value2' },
      { id: 3, name: 'sample3', value: 'value3' },
      { id: 4, name: 'sample4', value: 'value4' },
      { id: 5, name: 'sample5', value: 'value5' },
      { id: 6, name: 'sample6', value: 'value6' },
      { id: 7, name: 'sample7', value: 'value7' }
    ]
  }

  getSearchData() {
    this.finalData = [
      { type: this.searchForm.get('searchType2')?.value, value: this.searchForm.get('searchString2')?.value, dbFieldName: 'code' },
      { type: this.searchForm.get('searchType3')?.value, value: this.searchForm.get('searchString3')?.value, dbFieldName: 'Name' }
    ];
    console.log(this.finalData, 'final Dta');
    this.searchTableData = true;
  }

  checkAllCheckBox(ev: any) {
    console.log(ev.target.checked, 'dfd')
  }

  isAllCheckBoxChecked(id: number, event: any) {
    console.log(id);
    if (event.target.checked) {
      this.tableData.map((x: any) => {
        if (x.id === id) {
          this.filterData.push(x);
        }
      });
      console.log(this.filterData, 'add')
    } else {
      this.filterData.splice(this.filterData.findIndex(a => a.id === id), 1);
      console.log(this.filterData, 'remove');
    }
  }

  sendFinalData() {
    this.filterDataType = true;
    this.lgModalChild.hide();
    this.service.getFilterData.next(this.filterData);
  }

  show() {
    this.lgModalChild.show();
  }

  radioChecked(id: number) {
    console.log(id, 'number');
  }
}


