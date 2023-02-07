import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit {

  constructor() { }  
  resultMessage='';
  ngOnInit(): void {

  }

  commonPopupSuccessAlert(title:string ,message:string,navigateurl:string)
  {

    this.resultMessage=message;
    //$('#alertMessage .modal-body').html(message);
    jQuery('#alertSuccessPopupModal').modal('show');

  }

  
  commonPopupInfoAlert(title:string ,message:string,navigateurl:string)
  {

    this.resultMessage=message;
    //$('#alertMessage .modal-body').html(message);
    jQuery('#infoMessagePopupModal').modal('show');

  }
  commonPopupErrorAlert(title:string ,message:string,navigateurl:string)
  {

    this.resultMessage=message;
    //$('#alertMessage .modal-body').html(message);
    jQuery('#alertErrorPopUpModal').modal('show');

  }

  closeErrorModalPopup()
  {
    jQuery('.modal-backdrop').remove();
    jQuery('#alertErrorPopUpModal').modal('hide');
  }

  closeSuccessModalPopup()
  {
    jQuery('.modal-backdrop').remove();
    jQuery('#alertSuccessPopupModal').modal('hide');
  }
  closeInfoModalpopup()
  {
    jQuery('.modal-backdrop').remove();
    jQuery('#infoMessagePopupModal').modal('hide');
  }

}
