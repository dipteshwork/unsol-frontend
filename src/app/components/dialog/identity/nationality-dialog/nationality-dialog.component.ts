import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-nationality-dialog',
  templateUrl: './nationality-dialog.component.html',
  styleUrls: ['./nationality-dialog.component.scss']
})
export class NationalityDialogComponent implements OnInit {
  isInvalid = false;
  nationalttyDialogForm: FormGroup;
  isNationalityDialogFormSubmitted = false;
  nationFlag = false;
  lang: string;
  translations: {};
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NationalityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();

    this.nationalttyDialogForm = this.fb.group({
      nation: this.data.editRow == null ? null : this.data.editRow['nation'],
      nationalNote: this.data.editRow == null ? null : this.data.editRow['nationalNote']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(nationalttyDialogForm) {
    this.isNationalityDialogFormSubmitted = true;
    if (
      (this.nationalttyDialogForm.invalid && !this.nationFlag ) ||
      !nationalttyDialogForm.value
    ) {
      this.isInvalid = true;
      return;
    }
    const result = nationalttyDialogForm.value;
    this.dialogRef.close(result);
  }
}
