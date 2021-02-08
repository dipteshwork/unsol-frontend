import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export interface PobDialogData {
  street: string;
  city: string;
  title: string;
  stateProv: string;
  zipCde: string;
  locOptions: string;
  cntry: any;
  note: string;
  region: string;
  lat: number;
  lng: number;
  country: string;
  editRowIndex: number;
  editStreet: string;
  editCity: string;
  editTitle: string;
  editStateProv: string;
  editZipCde: string;
  editLocOptions: string;
  editNote: string;
  editRegion: string;
  editLat: number;
  editLng: number;
  editCountry: string;
  isReadOnly: boolean;
  isTranslationMode: boolean;
  lang: string;
  translations: {};
}

@Component({
  selector: 'app-add-pob-dialog',
  templateUrl: './add-pob-dialog.component.html',
  styleUrls: ['./add-pob-dialog.component.scss'],
})
export class AddPobDialogComponent implements OnInit, AfterViewInit {
  pobDialogform: FormGroup;
  lang: string;
  translations: {};
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PobDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    if (this.data.editRowIndex || this.data.editRowIndex == 0) {
      this.pobDialogform = this.editDocument();
    } else {
      this.pobDialogform = this.createDocument();
    }
    if (this.data.isReadOnly) {
      this.pobDialogform.disable();
    }
  }

  ngAfterViewInit(): void {
    this.pobDialogform.get('locOptions').valueChanges.subscribe((data) => data);
  }

  createDocument(): FormGroup {
    return this.formBuilder.group(
      {
        street: new FormControl(' '),
        city: '',
        title: '',
        stateProv: '',
        zipCde: '',
        region: null,
        lat: '',
        lng: '',
        note: '',
        country: null,
        locOptions: 'Address',
      },
      { validator: AddrDialogValidator }
    );
  }

  editDocument(): FormGroup {
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
        stateProv: this.data.editStateProv,
        zipCde: this.data.editZipCde,
        region: this.data.editRegion,
        lat: [this.data.editLat, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        lng: [this.data.editLng, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        note: this.data.editNote,
        country: this.data.editCountry,
        locOptions: locOptions,
        editRowIndex: this.data.editRowIndex,
      },
      { validator: AddrDialogValidator }
    );
  }

  submit(pobDialogform) {
    //aw check to see which radio button clicked to know whehter locationor addrees to be used
    if (pobDialogform.status == 'VALID') {
      this.dialogRef.close(pobDialogform.value);
    }
  }

  validateInput(field) {
    this.pobDialogform.patchValue({
      [field]: this.pobDialogform.controls[field].value,
    });
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
