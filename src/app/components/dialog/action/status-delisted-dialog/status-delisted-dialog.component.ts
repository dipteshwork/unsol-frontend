import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-status-delisted-dialog',
  templateUrl: './status-delisted-dialog.component.html',
  styleUrls: ['./status-delisted-dialog.component.scss'],
})
export class StatusDelistedDialogComponent implements OnInit {
  statusDelistedDialogForm: FormGroup;
  tomorrow = new Date();
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StatusDelistedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    const statusDelistedFm = new FormGroup({
      delistedStatusDte: new FormControl({ value: '' }, [Validators.required]),
      delistedStatusPRelease: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ]),
    });
    this.statusDelistedDialogForm = statusDelistedFm;
  }

  onSubmit(formdata, event) {
    this.dialogRef.close(formdata);
  }
}
