import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

import { AddressData } from '../../../../models/addressModel';

@Component({
  selector: 'app-add-address-dialog',
  templateUrl: './add-address-dialog.component.html',
  styleUrls: ['./add-address-dialog.component.scss'],
})
export class AddAddressDialogComponent implements OnInit {
  addrDialogform: FormGroup;
  lang: string;
  translations: {};

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    if (this.data.editRowIndex || this.data.editRowIndex == 0) {
      this.addrDialogform = this.editAddr();
    } else {
      this.addrDialogform = this.createAddr();
    }
    if (this.data.isReadOnly) {
      this.addrDialogform.disable();
    }
  }

  submit(addrDialogform) {
    if (addrDialogform.status == 'VALID') {
      const addrForm = addrDialogform.value;
      // if (addrForm.locOptions == 'Address') {
      //   if (!addrForm.country) {
      //     this.notifyService.showWarning('InValid country field', 'Warning');
      //     return;
      //   }
      //   if (!addrForm.street || !addrForm.city || !addrForm.stateProv) {
      //     this.notifyService.showWarning('InValid detailed address field', 'Warning');
      //     return;
      //   }
      // } else {
      //   if (!addrForm.region) {
      //     this.notifyService.showWarning('InValid region field', 'Warning');
      //     return;
      //   }
      //   if (!addrForm.lat || !addrForm.lng || isNaN (addrForm.lat)  || isNaN (addrForm.lng) ) {
      //     this.notifyService.showWarning('InValid latitude and longitude field', 'Warning');
      //     return;
      //   }
      // }

      this.dialogRef.close(addrDialogform.value);
    }
  }

  createAddr(): FormGroup {
    return this.formBuilder.group(
      {
        street: '',
        city: '',
        title: '',
        stateProv: '',
        zipCde: '',
        country: null,
        note: '',
        region: null,
        lat: '',
        lng: '',
        locOptions: 'Address',
      },
      { validator: AddrDialogValidator }
    );
  }

  validateInput(field) {
    this.addrDialogform.patchValue({
      [field]: this.addrDialogform.controls[field].value,
    });
  }

  editAddr(): FormGroup {
    let locOptions = '';
    if (
      (this.data.editStreet != null && this.data.editStreet.trim() != '') ||
      (this.data.editCity != null && this.data.editCity != '')
    ) {
      locOptions = 'Address';
    } else {
      locOptions = 'Region';
    }
    return this.formBuilder.group(
      {
        street: this.data.editStreet,
        city: this.data.editCity,
        title: this.data.editTitle,
        stateProv: this.data.editStateProv,
        zipCde: this.data.editZipCde,
        country: this.data.editCountry,
        editRowIndex: this.data.editRowIndex,
        note: this.data.editNote,
        region: this.data.editRegion,
        lat: this.data.editLat,
        lng: this.data.editLng,
        locOptions: locOptions,
      },
      { validator: AddrDialogValidator }
    );
  }

  getVal(nameOrgSptType, key) {
    return nameOrgSptType[key];
  }
}

const AddrDialogValidator: ValidatorFn = (fg: FormGroup) => {
  const country = fg.get('country').value;
  const region = fg.get('region').value;
  const locOptions = fg.get('locOptions').value;
  if (
    (locOptions == 'Address' && country == null) ||
    (locOptions != 'Address' && region == null)
  ) {
    return { addrErr: true };
  } else {
    return null;
  }
};
