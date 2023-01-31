import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmDialogData } from '../../common/model/confirm-dialog-data';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  confirmDialog(data: any): Observable<boolean> {
    return this.dialog
      .open(ConfirmComponent, {
        data,
        width: '1000px',
        disableClose: true,
      })
      .afterClosed();
  }
}
