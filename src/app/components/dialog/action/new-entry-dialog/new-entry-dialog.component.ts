import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { NewEntryData } from '../../../../models/newEntryModel';

@Component({
  selector: 'app-new-entry-dialog',
  templateUrl: './new-entry-dialog.component.html',
  styleUrls: ['./new-entry-dialog.component.scss'],
})
export class NewEntryDialogComponent implements OnInit {
  newEntryDialogSubmitted = false;
  newEntryDialogform: FormGroup;
  lang: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewEntryData
  ) {}

  ngOnInit() {
    this.lang = this.data.currentLanguage.toUpperCase();
    this.newEntryDialogform = this.createNewEntry();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createNewEntry(): FormGroup {
    const workingMainLanguage = this.data.language.find((item) => item.isWorking) ?
      this.data.language.find((item) => item.isWorking).acronym : 'EN';
    return this.formBuilder.group({
      entryType: new FormControl('Select Script', [
        Validators.required,
        Validators.pattern('^((?!Select).)*$'),
      ]),
      language: new FormControl(workingMainLanguage),
      title: '',
      regime: new FormControl('Select Regime', [
        Validators.required,
        Validators.pattern('^((?!Select).)*$'),
      ]),
      status: [{ value: 'PENDING', disabled: true }, []],
    });
  }

  getEntryTypeKeysArr(): string[] {
    return Object.keys(this.data.entryType);
  }

  getLanguage(): string {
    return this.data.language;
  }

  getValfromObjs(obj: {}): string {
    const idx = 0;
    const key = Object.keys(obj)[idx];
    return obj[key];
  }

  getRegimeValue(obj): string {
    const key = Object.keys(obj).find(
      (item) => item !== 'isActive' && item !== 'measures'
    );
    return obj[key];
  }

  getKeysArr(obj: {}): string[] {
    return Object.keys(obj);
  }

  getValsArr(obj: {}, key: string): string {
    return obj[key];
  }

  isEntryTypeEmpty(): boolean {
    return this.newEntryDialogform.value.entryType === 'Select Script';
  }

  isLanguageEmpty(): boolean {
    return !this.newEntryDialogform.value.language;
  }

  isRegimeEmpty(): boolean {
    return this.newEntryDialogform.value.regime === 'Select Regime';
  }

  get f() {
    return this.newEntryDialogform.controls;
  }

  submit(newEntryDialogform) {
    this.newEntryDialogSubmitted = true;

    if (this.newEntryDialogform.invalid) {
      return;
    }
    this.dialogRef.close(newEntryDialogform.value);
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }
}
