import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-submitted-by-dialog',
  templateUrl: './submitted-by-dialog.component.html',
  styleUrls: ['./submitted-by-dialog.component.scss'],
})
export class SubmittedByDialogComponent implements OnInit {
  submittedByDialogForm: FormGroup;
  translations: {};
  lang: string;
  isInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubmittedByDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.submittedByDialogForm = this.fb.group({
      countrytoChoose: [this.data.editSubmittedByCountry],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(editSubittedDialogform) {
    const result = editSubittedDialogform.value;
    if (!result.countrytoChoose) {
      this.isInvalid = true;
      return;
    }

    this.dialogRef.close(result);
  }
}
