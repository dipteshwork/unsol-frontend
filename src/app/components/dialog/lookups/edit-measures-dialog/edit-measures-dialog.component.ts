import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';
import { Language } from '../../../../models/languageModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../../classes/lookupLst';

interface EditMeasuresDialogData {
  title: string;
  lang: string;
  translations: any;
}

@Component({
  selector: 'app-edit-measures-dialog',
  templateUrl: './edit-measures-dialog.component.html',
  styleUrls: ['./edit-measures-dialog.component.scss'],
})
export class EditMeasuresDialogComponent implements OnInit {
  languageArr: Language[];
  editMeasuresDialogform: FormGroup;
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditMeasuresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditMeasuresDialogData,
    private lkupData: AdminService,
    private lookupSrv1: LookupCollproviderProvider,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    const measureObj = this.data['measure']
      ? this.data['measure']
      : { measureNm: '', isActive: true };
    this.languageArr = this.data['languageArr'];
    const allMeasures = this.data['isEditMode'] ? this.data['measures'] : '';
    const measures =
      this.data['isEditMode'] &&
      allMeasures.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].measureNm ===
            this.data['measure'].measureNm
      );

    this.editMeasuresDialogform = this.fb.group({
      isActive: new FormControl({
        value: measureObj.isActive,
        disabled: false,
      }),
    });
    this.languageArr.forEach((x) => {
      const key = x.acronym.toLowerCase();
      this.editMeasuresDialogform.addControl(
        `${key.toUpperCase()}_measure`,
        new FormControl(
          this.data['isEditMode'] && measures[x.acronym]
            ? measures[x.acronym].measureNm
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

    // this.lookupLst$ = this.lookupSrv1.getLookupColl();
    // this.appLang = this.authServ.getPreferLang();
    // this.appLang = this.appLang.toLowerCase();
    // this.translations = this.lookupSrv1.getTranslations();
  }

  changeLang(lang: string) {
    this.lang = lang.toLowerCase();
  }

  submit(editMeasuresDialogform) {
    if (editMeasuresDialogform.status === 'VALID') {
      const measure = editMeasuresDialogform.value;
      let newMeasure = {} as any;
      this.data['languageArr'].forEach((key) => {
        newMeasure = Object.assign(
          {
            [key.acronym]: {
              isActive: measure.isActive,
              measureNm: measure[`${key.acronym}_measure`],
            },
          },
          newMeasure
        );
      });

      if (!this.data['isEditMode']) {
        this.lkupData.addMeasure(newMeasure).subscribe((data) => {
          this.dialogRef.close({
            ...data,
            measures: [...data.measures, newMeasure],
          });
        });
      } else {
        const oldMeasure = this.data['measure'];
        const updatedMeasure = {
          newMeasure,
          oldMeasure,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lkupData.updateMeasure(updatedMeasure).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    }  else {
      this.langArr.forEach(lang => {
          if (editMeasuresDialogform.value[`${lang}_measure`] == '' || editMeasuresDialogform.value[`${lang}_measure`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }
}

const EditMeasuresDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
};
