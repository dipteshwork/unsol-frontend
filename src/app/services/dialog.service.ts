import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthDialogComponent } from '../components/dialog/auth-dialog/auth-dialog.component';

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog) {}
  openDialog(data): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '300px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
