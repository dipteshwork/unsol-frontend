import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { FeatureData } from '../../../../models/featureModel';


@Component({
  selector: 'app-add-feature-dialog',
  templateUrl: './add-feature-dialog.component.html',
  styleUrls: ['./add-feature-dialog.component.scss']
})
export class AddFeatureDialogComponent implements OnInit {
  featDialogform: FormGroup;
  translations: {};
  lang: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddFeatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeatureData, 
    ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();

    if (this.data.editRowIndex || this.data.editRowIndex == 0) {
      this.featDialogform = this.editFeat();
    } else {
      this.featDialogform = this.createFeat();
    }
    if (this.data.isReadOnly) {
      this.featDialogform.disable();
    }
  }

  createFeat(): FormGroup {
    return this.formBuilder.group({
      featureType: null,
      fStatus: [null],
      fValue: null,
      fNotes: '',
      title: ''
    }, { validator: FeatDialogValidator });
  }

  editFeat(): FormGroup {
    console.log(this.data.lang)
    console.log(this.data.editFeatureType)
    return this.formBuilder.group({
      featureType: this.data.editFeatureType,
      fStatus: this.data.editFStatus,
      fValue: this.data.editFValue,
      fNotes: this.data.editFNotes,
      editRowIndex: this.data.editRowIndex
    }, { validator: FeatDialogValidator });
  }

  submit(featDialogform) {
    if (featDialogform.status == 'VALID') {
      this.dialogRef.close(featDialogform.value);
    }
  }
}

const FeatDialogValidator: ValidatorFn = (fg: FormGroup) => {
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true }
    : null;
};
