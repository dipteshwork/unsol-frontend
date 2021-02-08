import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-review-dialog-component',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss'],
})
export class ReviewDialogComponent implements OnInit {
  recordReviewForm: FormGroup;
  translations: {};
  lang: string;
  tomorrow= new Date();
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.recordReviewForm = this.fb.group({
      updateType: new FormControl(this.data['updateType']),
      sanctionId: new FormControl(this.data['sanctionId']),
      listedOn: new FormControl('', Validators.required),
    });
  }

  submit(submitReviewForm) {
    if (submitReviewForm.status === 'VALID') {
      this.dialogRef.close(submitReviewForm);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
