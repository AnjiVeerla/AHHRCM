import { NumberOnlyDirective } from './../common/number-only.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ConfirmComponent } from './confirm/confirm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [NumberOnlyDirective, ConfirmComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatToolbarModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NumberOnlyDirective,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    ConfirmComponent,
    MatDialogModule,
    MatToolbarModule
  ],
})
export class SharedModule { }
