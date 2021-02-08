import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-amend-dialog',
  templateUrl: './amend-dialog.component.html',
  styleUrls: ['./amend-dialog.component.scss'],
})
export class AmendDialogComponent implements OnInit {
  amendForm: FormGroup;
  translations: {};
  lang: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AmendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.amendForm = this.formBuilder.group({
      text1: new FormControl(null),
    });
  }

  submit(submitReviewForm) {
    this.dialogRef.close('Confirm');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
