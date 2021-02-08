import { Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export interface DobDialogData {
  title: string;
  dobSpecDte: string;
  dobSubset: string;
  dobSubsetType: string;
  dobTo: string;
  dobFrom: string;
  dobNote: string;
  dobType: string;
  editDobSpecDte: string;
  editDobSubset: string;
  editDobSubsetTyp: string;
  editDobTo: string;
  editDobFrom: string;
  editDobNote: string;
  editRowIndex: number;
  dobDteTyp: string;
  dobBirthDte: string;
  isReadOnly: boolean;
  isFreeTextEditable: string;
  isTranslationMode: boolean;
  lang: string;
  translations: {};
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    // dateInput: 'MM/YYYY',
    // monthYearLabel: 'MMM YYYY',
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMAT_YYYY = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const DATE_FORMAT_MMYYYY = {
  parse: {
    dateInput: 'YYYY.MM.DD',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[dateFormatYYYY]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_YYYY }],
})
export class CustomDateFormatYYYY {}

@Directive({
  selector: '[dateFormatMMYYYY]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_MMYYYY }],
})
export class CustomDateFormatMMYYYY {}

@Component({
  selector: 'app-add-dob-dialog',
  templateUrl: './add-dob-dialog.component.html',
  styleUrls: ['./add-dob-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddDobDialogComponent implements OnInit {
  dobSubsetDte = new FormControl(moment().format('MM/DD/YYYY'));
  dobDialogform: FormGroup;
  chosenDte: string;
  dte: string[] = ['Specific', 'Range'];
  translations: {};
  lang: string;
  criteriaDate: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dobData: DobDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.dobData.translations;
    this.lang = this.dobData.lang.toLowerCase();
    if (this.dobData.editRowIndex || this.dobData.editRowIndex == 0) {
      this.dobDialogform = this.editDob();
    } else {
      this.dobDialogform = this.createDob();
    }
    if (this.dobData.isReadOnly) {
      this.dobDialogform.disable();
    }
  }

  submit(dobDialogform) {
    if (dobDialogform.status == 'VALID') {
      this.dialogRef.close(dobDialogform.value);
    }
  }

  editDob(): FormGroup {
    let dobSubsetDte = null;
    let fromDte: Date = null;
    let toDte: Date = null;
    let subsetTyp = this.dobData.editDobSubsetTyp;
    let specificDte: Moment;
    let specDate: Date = null;

    if (this.dobData.dobType == 'Range') {
      if (this.dobData.editDobSubsetTyp != null) {
        if (this.dobData.editDobSubsetTyp == 'mmyyyy') {
          const dteStr: string = this.dobData['dobBirthDte'];
          dteStr.substr(2, 4);
          dobSubsetDte = new Date(
            '' + dteStr.substr(3, 4) + '/' + dteStr.substr(0, 2)
          );
        } else if (this.dobData.editDobSubsetTyp == 'yyyy') {
          dobSubsetDte = new Date('' + parseInt(this.dobData['dobBirthDte']));
        }
      } else if (
        (this.dobData.editDobFrom != null && this.dobData.editDobFrom != '') &&
        (this.dobData.editDobTo != null && this.dobData.editDobTo != '')
      ) {
        if (typeof this.dobData.editDobFrom == 'string') {
          fromDte = new Date(this.dobData.editDobFrom);
          toDte = new Date(this.dobData.editDobTo);
        } else if (this.dobData.editDobFrom['_isAMomentObject']) {
          const fromMoment = this.dobData.editDobFrom['_i'];
          const toMoment = this.dobData.editDobTo['_i'];
          fromDte = new Date(
            fromMoment['year'],
            fromMoment['month'],
            fromMoment['date']
          );
          toDte = new Date(
            toMoment['year'],
            toMoment['month'],
            toMoment['date']
          );
        }
      } else {
        const subsetDte = this.dobData['dobBirthDte'];
        const dividerIndex = subsetDte.indexOf('/');
        if (dividerIndex != -1) {
          dobSubsetDte = new Date(
            subsetDte.substring(dividerIndex + 1) +
              '/' +
              subsetDte.substring(0, dividerIndex)
          );
          subsetTyp = 'mmyyyy';
          this.dobData.editDobSubsetTyp = subsetTyp;
        } else {
          dobSubsetDte = new Date('' + parseInt(subsetDte));
          subsetTyp = 'yyyy';
          this.dobData.editDobSubsetTyp = subsetTyp;
        }
      }
    } else {
      specificDte = moment(this.dobData.dobBirthDte, 'YYYY/MM/DD');
      specDate = new Date(specificDte['_i']);
    }

    return this.formBuilder.group(
      {
        dobSubsetDte: dobSubsetDte, //new FormControl(this.dobData['editDobSubsetDte']),   // here we need to test reading in a value
        dobSpecDte: specDate, //  this.dobData.dobBirthDte, // this.dobData.editDobSpecDte,  // if nto empty string or null, then it is specific date
        dobSubsetType: this.dobData.editDobSubsetTyp,
        dobSubset: this.dobData.editDobSubset,
        dobTo: toDte,
        dobFrom: fromDte,
        dobNote: this.dobData.dobNote,
        dobType: this.dobData.dobType,
        editRowIndex: this.dobData.editRowIndex,
      },
      { validator: DobDialogValidator }
    );
  }

  createDob(): FormGroup {
    return this.formBuilder.group(
      {
        dobSubsetDte: new FormControl(null),
        dobSpecDte: new FormControl(null),
        dobSubsetType: null,
        dobSubset: 'subset',
        dobTo: null,
        dobFrom: null,
        dobNote: '',
        dobType: new FormControl('Specific'),
      },
      { validator: DobDialogValidator }
    );
  }

  // move this function to a utility file and call as needed after importation
  getArrOfKeys(nameOrgSptType) {
    return Object.keys(nameOrgSptType);
  }

  chosenYearHandler(normalizedYear: Moment) {
    // try to close the datepikcer if only YYYY is required, so to save user a click
    const ctrlValue = this.dobDialogform.get('dobSubsetDte').value; //this.dobSubsetDte.value;
    ctrlValue.year(normalizedYear.year());
    this.dobDialogform.get('dobSubsetDte').setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    // this.dobDialogform.get('dobSubsetDte').
    const ctrlValue = this.dobDialogform.get('dobSubsetDte').value; // this.dobSubsetDte.value;
    ctrlValue.month(normalizedMonth.month());
    this.dobDialogform.get('dobSubsetDte').setValue(ctrlValue);
    datepicker.close();
  }
}

const DobDialogValidator: ValidatorFn = (fg: FormGroup) => {
  const dobSpecDte = fg.get('dobSpecDte').value;
  const dobSubset = fg.get('dobSubset').value;
  const dobSubsetDte = fg.get('dobSubsetDte').value;
  const dobSubsetType = fg.get('dobSubsetType').value;
  const dobType = fg.get('dobType').value;
  const dobFrom = fg.get('dobFrom').value;
  const dobTo = fg.get('dobTo').value;

  if (dobType == 'Specific' && (dobSpecDte == null || dobSpecDte == '')) {
    return { specDteErr: true };
  } else if (dobType != 'Specific' && dobSubset == 'subset' && !dobSubsetDte) {
    return { dobSubsetDteErr: true };
  } else if (
    dobType != 'Specific' &&
    dobSubset == 'fRange' &&
    (!dobFrom || !dobTo)
  ) {
    return { dobSubsetDteErr: true };
  } else {
    return null;
  }
};
