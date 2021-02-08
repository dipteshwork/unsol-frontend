import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { LookupLst } from '../../../../classes/lookupLst';
import { Language } from '../../../../models/languageModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';

@Component({
  selector: 'app-biometric-type-dialog',
  templateUrl: './biometric-type-dialog.component.html',
  styleUrls: ['./biometric-type-dialog.component.scss'],
})
export class BiometricTypeDialogComponent implements OnInit {
  editDialogform: FormGroup;
  languageArr: Language[];
  biometricData = '';
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BiometricTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string, lang: string, translations: any },
    private lookupService: AdminService,
    private lookupCollprovider: LookupCollproviderProvider,
  ) {}

  ngOnInit() {

    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    const currentObj = this.data['biometricType']
      ? this.data['biometricType']
      : { biometricTypeName: '', isActive: true };
    this.languageArr = this.data['languageArr'];
    const allArrs = this.data['isEditMode'] ? this.data['biometricTypes'] : '';
    const subObjects =
      this.data['isEditMode'] &&
      allArrs.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].biometricTypeName ===
            this.data['biometricType'].biometricTypeName
      );

    this.editDialogform = this.fb.group({
      isActive: new FormControl({
        value: currentObj.isActive,
        disabled: false,
      }),
    });

    this.languageArr.forEach((x) => {
      const key = x.acronym.toLowerCase();
      this.editDialogform.addControl(`${key.toUpperCase()}_biometricType`, new FormControl(this.data['isEditMode'] && subObjects && subObjects[x.acronym] ? subObjects[x.acronym].biometricTypeName
            : '',
        [Validators.required, this.noWhitespaceValidator]
        )
      );
    });
  }
  
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  loadLookUp() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupLst$['language'].map(
      lang => lang.acronym
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
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
              biometricTypeName: formValue[`${key.acronym}_biometricType`],
            },
          },
          newObject
        );
      });

      if (!this.data['isEditMode']) {
        this.lookupService.addBiometric(newObject).subscribe((data) => {
          if (data.biometricType && data.biometricType.length > 0) {
            this.dialogRef.close({
              ...data,
              biometricType: [...data.biometricType, newObject],
            });
          } else {
            this.dialogRef.close({
              ...data,
              biometricType: [newObject],
            });
          }
        });
      } else {
        const oldData = this.data['biometricType'];
        const updatedTransData = {
          newObject,
          oldData,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lookupService.updateBiometric(updatedTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[`${lang}_biometricType`].trim() == '' || editDialogform.value[`${lang}_biometricType`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }
}