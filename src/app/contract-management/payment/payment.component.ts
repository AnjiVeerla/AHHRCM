import { Component, OnInit } from '@angular/core';

declare var $: any; 
declare let moyasar: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  //paymentAmount:Number;

  constructor() { }

  ngOnInit(): void {
  }

  ShowPayment()
  {    
  
    
    moyasar.init({
      // Required
      // Specify where to render the form
      // Can be a valid CSS selector and a reference to a DOM element
      element: '.mysr-form',

      // Required
      // Amount in the smallest currency unit
      // For example:
      // 10 SAR = 10 * 100 Halalas
      // 10 KWD = 10 * 1000 Fils
      // 10 JPY = 10 JPY (Japanese Yen does not have fractions)
      amount: 10000,

      // Required
      // Currency of the payment transation
      currency: 'SAR',

      // Required
      // A small description of the current payment process
      description: 'Consultation Bill Amount',

      // Required
      publishable_api_key: 'pk_test_WNzVNDPgy4T2Ka7U9M5zXY8bHYJe6zQiUA6vQFnQ',

      // Required
      // This URL is used to redirect the user when payment process has completed
      // Payment can be either a success or a failure, which you need to verify on you system (We will show this in a couple of lines)
      callback_url: 'http://localhost:4200/Paymentsuccess',

      // Optional
      // Required payments methods
      // Default: ['creditcard', 'applepay', 'stcpay']
      methods: [
          'creditcard',
      ],
  });

  }

  // Capture the form submit button

 

  

}
