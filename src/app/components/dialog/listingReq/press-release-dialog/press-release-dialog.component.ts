import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import * as _moment from 'moment';

export interface DialogData {
  nameType: any;
  name: string;
  title: string;
  order: number;
  script: {};
  editNameType: {};
  editName: string;
  editOrder: number;
  editScript: {};
  ordNumUsedArr: number[];
  nameTypeArr: string[];
  editRowIndex: number;
  isReadOnly: boolean;
  lang: string;
  translations: {};
}

@Component({
  selector: 'press-release-dialog',
  templateUrl: './press-release-dialog.component.html',
  styleUrls: ['./press-release-dialog.component.scss'],
})
export class PressReleaseDialogComponent implements OnInit {
  isInvalid = false;
  lang: string;
  translations: {};
  defaultRelease = [];

  pressReleaseItem = '';

  constructor(
    public dialogRef: MatDialogRef<PressReleaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  onSetDirectionState(val): void {
    if (!this.data.isReadOnly) {
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();

    const identityDataArr = this.data.sanctionData.idArr;
    const pressReleaseObj = this.data.sanctionData.lstReq.pressRelease.length > 0 ? this.data.sanctionData.lstReq.pressRelease[0] : {};
    this.pressReleaseItem = Object.keys(pressReleaseObj).length > 0 ? pressReleaseObj.pressRelease : '';
  }

  submit() {
    this.dialogRef.close();
  }

}
