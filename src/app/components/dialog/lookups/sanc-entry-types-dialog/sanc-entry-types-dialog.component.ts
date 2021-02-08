import { Component, OnInit, Inject, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Language } from '../../../../models/languageModel';
import { ValidatorFn } from '@angular/forms';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';

import { AdminService } from '../../../../services/admin.service';
import { LookupLst } from '../../../../classes/lookupLst';

@Component({
  selector: 'app-sanc-entry-types-dialog',
  templateUrl: './sanc-entry-types-dialog.component.html',
  styleUrls: ['./sanc-entry-types-dialog.component.scss'],
})
export class SancEntryTypesDialogComponent implements OnInit {
  languageArr: Language[];
  sancEntryTypForm: FormGroup;
  loadLookup: LookupCollproviderProvider;
  lang: string;
  appLang: string;
  translations: {};
  langArr: string[];
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    private lookupService: AdminService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SancEntryTypesDialogComponent>,
    private lookupCollprovider: LookupCollproviderProvider,
  ) {}

  ngOnInit() {

    //old data
    // this.loadLookUp();
    // this.translations = this.data.translations;
    // this.appLang = this.data.lang.toLowerCase();
    // this.lang = this.appLang;
    // const modalObj = this.data['entryType']
    // ? this.data['entryType']
    // : { entryTypeName: '', isActive: true, prefix: '' };

    // if (this.data.row) {
    //   this.sancEntryTypForm = this.editSancEntryTypes();
    // } else {
    //   this.sancEntryTypForm = this.addNewSancEntryTypes();
    // }

    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    const currentObj = this.data['entryType']
      ? this.data['entryType']
      : { entryTypeName: '', isActive: true, prefix: '' };
    this.languageArr = this.data['languageArr'];
    const allArrs = this.data['isEditMode'] ? this.data['entryTypes'] : '';
    const subObjects =
      this.data['isEditMode'] &&
      allArrs.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].entryTypeName ===
            this.data['entryType'].entryTypeName
      );

    this.sancEntryTypForm = this.fb.group({
      isActive: new FormControl({
        value: currentObj.isActive,
        disabled: false,
      }),
    });

    this.sancEntryTypForm.addControl('prefix', new FormControl(currentObj.prefix));
    this.languageArr.forEach((x) => {
      const key = x.acronym.toLowerCase();
      this.sancEntryTypForm.addControl(
        `${key.toUpperCase()}_entryType`,
        new FormControl(
          this.data['isEditMode'] && subObjects[x.acronym]
            ? subObjects[x.acronym].entryTypeName
            : '',
          Validators.required
        )
      );
    });
  }

  loadLookUp() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupLst$['language'].map(
      lang => lang.acronym
    );
  }

  changeLang(lang: string) {
    this.lang = lang.toLowerCase();
  }

  onSubmit(editDialogform) {
    if (editDialogform.status === 'VALID') {
      const formValue = editDialogform.value;
      let newObject = {} as any;
      this.data['languageArr'].forEach((key) => {
        newObject = Object.assign(
          {
            [key.acronym]: {
              isActive: formValue.isActive,
              entryTypeName: formValue[`${key.acronym}_entryType`],
              prefix: formValue.prefix,
            },
          },
          newObject
        );
      });

      if (!this.data['isEditMode']) {
        this.lookupService.addEntryTyp(newObject).subscribe((data) => {
          if (data.entryType && data.entryType.length > 0) {
            this.dialogRef.close({
              ...data,
              entryType: [...data.entryType, newObject],
            });
          } else {
            this.dialogRef.close({
              ...data,
              entryType: [newObject],
            });
          }
        });
      } else {
        const oldData = this.data['entryType'];
        const updatedTransData = {
          newObject,
          oldData,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lookupService.updateEntryTyp(updatedTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[`${lang}_entryType`] == '' || editDialogform.value[`${lang}_entryType`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }

  // editSancEntryTypes(): FormGroup {
  //   const formGroup = {};
  //   this.langArr.map(
  //     lang => Object.assign(formGroup,
  //       { [`${lang.toLowerCase()}EntryTypNm`]: new FormControl(this.data['row'][`${lang.toLowerCase()}_name`],
  //           {validators: Validators.required}) })
  //   );
  //   Object.assign(formGroup,
  //     { entryPrefix: new FormControl(this.data['row']['prefix'], {
  //         validators: [Validators.required, Validators.maxLength(1)],
  //       }) });
  //   return this.fb.group( formGroup,
  //     { validator: EditEntryTypDialogValidator }
  //   );
  // }

  // addNewSancEntryTypes(): FormGroup {
  //   const formGroup = {};
  //   this.langArr.map(
  //     lang => Object.assign(formGroup,
  //       { [`${lang.toLowerCase()}EntryTypNm`]: new FormControl('',
  //           {validators: Validators.required}) })
  //   );
  //   Object.assign(formGroup,
  //     { entryPrefix: new FormControl('', {
  //         validators: [Validators.required, Validators.maxLength(1)],
  //       }) });
  //   return this.fb.group( formGroup,
  //     { validator: EditEntryTypDialogValidator }
  //   );
  // }

  // onSubmit(sancEntryTypForm) {
  //   if (sancEntryTypForm.status === 'VALID') {
  //     const newData = sancEntryTypForm.value;
  //     const modifiedRowData = {};

  //     if (!this.data['row']) {
  //       this.lookupSrv.addEntryTyp(newData).subscribe((data) => {
  //         this.dialogRef.close(data);
  //       });
  //     } else {
  //       const oldData = this.data['row'];
  //       const newTransData: any = {
  //         newEntryType: newData,
  //         oldEntryType: oldData,
  //       };
  //       this.lookupSrv.updateEntryTyp(newTransData).subscribe((data) => {
  //         this.dialogRef.close(data);
  //       });
  //     }
  //   } else {
  //     this.langArr.forEach(lang => {
  //         if ( sancEntryTypForm.value[lang.toLowerCase() + 'EntryTypNm'] == '' || sancEntryTypForm.value[lang.toLowerCase() + 'EntryTypNm'] == null) {
  //           this.changeLang(lang);
  //           return;
  //         }
  //       }
  //     )
  //   }

  //   // if (this.data.row && sancEntryTypForm.status == 'VALID') {
  //   //   const oldRowData = this.data.row;
  //   //   const modifiedRowData = sancEntryTypForm.value;
  //   //   console.log('the old data is ', oldRowData, ' while the modified data is ', modifiedRowData);
  //   //   const dta: any = {'oldRowData': oldRowData, 'modifiedRowData': modifiedRowData};
  //   //
  //   //   let result = null;
  //   //   // here we call backend to update teh database info
  //   //   this.lookupSrv.updateEntryTyp(dta).subscribe(
  //   //     data => {
  //   //       console.log('after editing Sanction Entry types the data is', data);
  //   //       result = data;
  //   //       this.dialogRef.close(result);
  //   //     }
  //   //   );
  //   //
  //   // } else if (sancEntryTypForm.status == 'VALID') {
  //   //   // here we call backend to update teh database info
  //   //   let result = null;
  //   //   const modifiedRowData = sancEntryTypForm.value;
  //   //   const dta: any = {'modifiedRowData': modifiedRowData};
  //   //   this.lookupSrv.addEntryTyp(dta).subscribe(
  //   //     data => {
  //   //       console.log('after adding  Sanction Entry types the data is', data);
  //   //       result = data;
  //   //       this.dialogRef.close(result);
  //   //     }
  //   //   );
  //   // }
  // }
}

export interface EntryTyp {
  entryPrefix: string;
  entryTyp: string;
}

const EditEntryTypDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
  /*
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true}
    : null;
  */
};
