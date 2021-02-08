import { Component, Inject } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
})
export class AuthDialogComponent {
  modalTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adalService: AdalService
  ) {
    this.modalTitle = data.reason;
  }

  onAuthClickNo() {
  }

  onAuthClickYes() {
    this.adalService.login();
  }
}
