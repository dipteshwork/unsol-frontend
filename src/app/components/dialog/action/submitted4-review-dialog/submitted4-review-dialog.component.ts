import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-submitted4-review-dialog',
  templateUrl: './submitted4-review-dialog.component.html',
  styleUrls: ['./submitted4-review-dialog.component.scss'],
})
export class Submitted4ReviewDialogComponent implements OnInit {
  submitReviewForm: FormGroup;
  translations: {};
  lang: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<Submitted4ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.submitReviewForm = this.formBuilder.group({
      text1: new FormControl(null),
    });
  }

  submit() {
    this.dialogRef.close('Confirm');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
