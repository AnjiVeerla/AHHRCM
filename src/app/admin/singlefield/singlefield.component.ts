import { Component, OnInit,ViewChild } from '@angular/core';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-singlefield',
  templateUrl: './singlefield.component.html',
  styleUrls: ['./singlefield.component.scss']
})
export class SinglefieldComponent implements OnInit {
@ViewChild(AlertPopupComponent) alertModalPopup:any;
  constructor() { }

  ngOnInit(): void {
  }

  showSuccessAlert()
  {  
 this.alertModalPopup.commonPopupSuccessAlert('Success','Message Information','company-configuration');
  }

  showInfoAlert()
  {  
 this.alertModalPopup.commonPopupInfoAlert('Alert','Testing','');
  }

  showErrorAlert()
  {  
 this.alertModalPopup.commonPopupErrorAlert('Error','Testing','');
  }

}
