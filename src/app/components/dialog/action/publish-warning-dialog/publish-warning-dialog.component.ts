import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-publish-warning-dialog',
  templateUrl: './publish-warning-dialog.component.html',
  styleUrls: ['./publish-warning-dialog.component.scss'],
})
export class PublishWarningDialogComponent implements OnInit {
  submitPublishWarningForm: FormGroup;
  translations: {};
  ongoingAmendmentsDataSrc = new MatTableDataSource();
  lang: string;

  ongoingAmendmentsDisplayedColumns: string[] = [
    'version',
    'status',
    'modifiedDte',
  ];

  constructor(
    private dialogRef: MatDialogRef<PublishWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.ongoingAmendmentsDataSrc.data = this.data['amendInfo']
  }

  submit() {
    this.dialogRef.close(true);
  }

  onNoClick(result): void {
    this.dialogRef.close(result);
  }
}
