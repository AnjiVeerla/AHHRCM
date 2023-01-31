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
import { PatientRegistrationService } from '../../patient-registration/services/patient-registration.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
