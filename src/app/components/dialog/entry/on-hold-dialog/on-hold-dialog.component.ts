import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-on-hold-dialog',
  templateUrl: './on-hold-dialog.component.html',
  styleUrls: ['./on-hold-dialog.component.scss'],
})
export class OnHoldDialogComponent implements OnInit {
  onHoldSanctionForm: FormGroup;
  lang: string;
  translations: {};
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OnHoldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.onHoldSanctionForm = this.fb.group({
      onHoldQuery: new FormControl(
        'Do you really want to move to onHold status?'
      ),
      sanctionId: new FormControl(this.data['sanctionId']),
    });
  }

  submit(onHoldSanctionForm) {
    this.dialogRef.close(onHoldSanctionForm);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
