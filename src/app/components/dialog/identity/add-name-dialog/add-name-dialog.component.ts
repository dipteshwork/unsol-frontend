import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';

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
  isTranslationMode: boolean;
  lang: string;
  translations: {};
}

@Component({
  selector: 'app-add-name-dialog',
  templateUrl: './add-name-dialog.component.html',
  styleUrls: ['./add-name-dialog.component.scss'],
})
export class AddNameDialogComponent implements OnInit {
  isInvalid = false;
  nameDialogForm: FormGroup;
  isNameDialogFormSubmitted = false;
  lang: string;
  translations: {};
  txtDirectionState = 'normal';
  fullNameFlag = false;
  fullNameValue: any;
  otherNameType = false;

  constructor(
    public dialogRef: MatDialogRef<AddNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {}

  onSetDirectionState(val): void {
    if (!this.data.isReadOnly) {
      this.txtDirectionState = val.toLowerCase();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    // this.fullNameFlag = this.data.nameTypeArr.includes('FULL_NAME') || this.data.nameTypeArr.includes(this.translations[this.lang]['FULL_NAME']);
    if (typeof(this.data.nameType) === 'string') {
      this.fullNameFlag = true;
      this.otherNameType = true;
    } else {
      const NameTypeValues = Object.values(this.data.nameType);
      const fullNameObjectValue = NameTypeValues.length > 0 ? NameTypeValues.filter((item: string) => (item.includes('FULL_NAME')))[0] : '';
      this.fullNameValue = fullNameObjectValue;
      this.fullNameFlag = fullNameObjectValue ? this.data.nameTypeArr.includes(fullNameObjectValue.toString()) : false;
    }

    if (this.data.editRowIndex || this.data.editRowIndex == 0) {
      this.nameDialogForm = this.fb.group({
        name: [this.data.editName, Validators.required],
        nameType: [
          this.data.editNameType,
          Validators.required,
          // this.data.isReadOnly,
        ],
        script: [
          { value: this.data.editScript, disabled: this.data.isReadOnly },
        ],
        ordNumUsedArr: [{ value: this.data.ordNumUsedArr }],
        order: [
          this.data.editOrder,
          Validators.required,
          // this.fullNameFlag,
        ],
        editRowIndex: this.data.editRowIndex,
      });
    } else {
      this.nameDialogForm = this.fb.group(
        {
          name: [this.data.name, Validators.required],
          nameType: [
            this.data.nameType,
            Validators.required,
            // this.data.isReadOnly,
          ],
          script: [{ value: this.data.script, disabled: this.data.isReadOnly }],
          ordNumUsedArr: [{ value: this.data.ordNumUsedArr }],
          order: [
            this.data.order,
            Validators.required,
            // this.fullNameFlag,
          ],
        },
      );
    }
    if (this.data.isReadOnly) {
      this.nameDialogForm.disable();
    }
  }

  get getNameTypeValue() {
    return this.nameDialogForm.value.nameType;
  }

  submit(nameDialogForm) {
    this.isNameDialogFormSubmitted = true;

    if (
      (this.nameDialogForm.invalid && !this.fullNameFlag ) ||
      !nameDialogForm.value.script ||
      !nameDialogForm.value.name
    ) {
      this.isInvalid = true;
      return;
    }

    if (this.data.editRowIndex || this.data.editRowIndex === 0) {
      if (this.data.ordNumUsedArr.indexOf(nameDialogForm.value.order) === -1) {
        this.data.ordNumUsedArr.push(nameDialogForm.value.order);
      }
    } else {
      this.data.ordNumUsedArr.push(nameDialogForm.value.order);
    }

    this.dialogRef.close(nameDialogForm.value);
  }

  findNone = function (haystackArr, arr) {
    return arr.some(function (v) {
      return haystackArr.indexOf(v) == -1;
    });
  };

  testThis(str, myArr) {
    if (myArr && typeof myArr !== 'undefined' && myArr.length > 0) {
      return (function (str, myArr) {
        if (myArr.indexOf(str) != -1) {
          return true;
        } else {
          return false;
        }
      })();
    } else {
      return false;
    }
  }

  getArrOfKeys(nameOrgSptType) {
    return Object.keys(nameOrgSptType);
  }

  getArrOfValues(nameOrgSptType) {
    return Object.values(nameOrgSptType);
  }

  getVal(nameOrgSptType, key) {
    return nameOrgSptType[key];
  }

  getNameOrScptTypKeys(nameOrgSptType) {
    const obj = nameOrgSptType;
    const NmScpTypKeyArr = [];
    obj.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        console.log('key:' + key + 'value:' + item[key]);
        NmScpTypKeyArr.push(key);
      });
    });
    return NmScpTypKeyArr;
  }

  getNameOrScptTypVals(nameOrgSptType) {
    const obj = nameOrgSptType;
    const NmScpTypValArr = [];
    obj.forEach(function (item) {
      Object.keys(item).forEach(function (key) {
        NmScpTypValArr.push(item[key]);
      });
    });
    return NmScpTypValArr;
  }
}

export const orderValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const orderNum = control.get('order');
  orderNum.markAsTouched();
  const ordNumUsedArr = control.get('ordNumUsedArr');
  if (
    ordNumUsedArr.value.value != null &&
    typeof ordNumUsedArr !== 'undefined' &&
    ordNumUsedArr.value.value.length > 0
  ) {
    if (ordNumUsedArr.value.value.indexOf(orderNum.value) != -1) {
      return { order: true };
    } else {
      return null;
    }
  }
  return null;
};
