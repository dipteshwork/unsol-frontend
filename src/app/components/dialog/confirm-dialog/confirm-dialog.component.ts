import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  xmlJsonRptForm: FormGroup;
  testLangVar = 'AR';

  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(xmlJsonRptForm: FormGroup) {
  }
}

export interface Rpt {
  value: string;
  viewValue: string;
}
