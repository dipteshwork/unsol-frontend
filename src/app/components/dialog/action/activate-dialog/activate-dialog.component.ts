import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-activate-dialog',
  templateUrl: './activate-dialog.component.html',
  styleUrls: ['./activate-dialog.component.scss'],
})
export class ActivateDialogComponent implements OnInit {
  activateForm: FormGroup;
  tomorrow = new Date();
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ActivateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.activateForm = this.fb.group({
      updteType: new FormControl(this.data['updteType']),
      sanctionId: new FormControl(this.data['sanctionId']),
      listedOn: new FormControl(''),
    });
  }

  submit(submitReviewForm) {
    this.dialogRef.close(submitReviewForm);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
