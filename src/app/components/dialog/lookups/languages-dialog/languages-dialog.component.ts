import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { Language } from '../../../../models/languageModel';

@Component({
  selector: 'app-languages-dialog',
  templateUrl: './languages-dialog.component.html',
  styleUrls: ['./languages-dialog.component.scss']
})
export class LanguagesDialogComponent implements OnInit {
  languagesDialogform: FormGroup;
  isWorking: boolean;
  isOfficial: boolean;
  isActive: boolean;
  lang: string;
  translations = {};


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LanguagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private lkupData: AdminService
  ) {}

  ngOnInit() {
    this.languagesDialogform = this.editLanguage();
    this.lang = this.data.lang;
    this.translations = this.data.translations;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editLanguage(): FormGroup {
    if (this.data.row) {
      return this.fb.group({
        name: new FormControl(this.data.row.name),
        acronym: new FormControl(this.data.row.acronym),
        isOfficial: new FormControl(this.data.row.isOfficial),
        isWorking: new FormControl(this.data.row.isWorking),
        isActive: new FormControl(this.data.row.isActive)
      }, { validator: EditLanguageDialogValidator });
    } else {
      return this.fb.group({
        name: new FormControl(''),
        acronym: new FormControl(''),
        isOfficial: new FormControl(false),
        isWorking: new FormControl(false),
        isActive: new FormControl(false)
      }, { validator: EditLanguageDialogValidator });
    }
  }

  updateIsWorking(isChecked: boolean): void {
    this.isWorking = isChecked;
  }

  updateIsOfficial(isChecked: boolean): void {
    this.isOfficial = isChecked;
  }

  updateIsActive(isChecked: boolean): void {
    this.isActive = isChecked;
  }

  submit(languagesDialogform) {
    if (this.data.row && languagesDialogform.status == 'VALID') {
      const oldRowData = this.data.row;
      const workingLang = this.data.workingLang;
      const modifiedRowData = languagesDialogform.value;
      const updateData = { oldRowData, modifiedRowData, workingLang };

      this.lkupData.updateLanguage(updateData).subscribe(
        res => {
          console.log('updated successfully: ', res);
        }
      );

      this.dialogRef.close({ oldRowData, modifiedRowData });
    } else {
      if (languagesDialogform.status == 'VALID') {
        this.lkupData.addLanguage(languagesDialogform.value as Language).subscribe(
          res => {
            console.log('added successfully: ', res);
          }
        );

        window.location.href = '/';
        this.dialogRef.close(languagesDialogform.value);
      }
    }
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()][str] || str;
  }
}

const EditLanguageDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
  /*
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true}
    : null;
  */
};
