import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { Measures } from '../../../../models/measuresModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../../classes/lookupLst';

@Component({
  selector: 'app-edit-measures-dialog',
  templateUrl: './edit-regimes-dialog.component.html',
  styleUrls: ['./edit-regimes-dialog.component.scss'],
})
export class EditRegimeMeasuresDialogComponent implements OnInit {
  measuresArr = [];
  selectedMeasures = [];
  editMeasuresDialogform: FormGroup;
  appLang: string;
  lang: string;
  translations: {};
  langArr: string[];
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditRegimeMeasuresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Measures,
    private lkupData: AdminService,
    private lookupCollprovider: LookupCollproviderProvider
  ) {}

  ngOnInit() {
    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    this.measuresArr = this.data.allMeasures;
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.createForm();
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

  createForm(): void {
    const formGroup = {};
    if (this.data.row) {
      const row = this.data.row;
      const lang = this.data['lang'].toUpperCase();
      const regime = this.data['regimes'].find(
        (item) => item[lang] && item[lang][row.prefix] === row.name[lang]
      );

      this.selectedMeasures = [...row.measures['EN']] || [];
      this.langArr.map(
        lang1 => Object.assign(formGroup,
          { [`${lang1.toLowerCase()}RegimeName`]: new FormControl(row.name[lang1], Validators.required) })
      );
      Object.assign(formGroup,
        { name: new FormControl(row.name) });
      Object.assign(formGroup,
        { prefix: new FormControl(row.prefix, Validators.required) });
      Object.assign(formGroup,
        { isActive: new FormControl(row.isActive) });
      Object.assign(formGroup,
        { measures: this.createApplicableMeasures() });
    } else {
      this.langArr.map(
        lang => Object.assign(formGroup,
          { [`${lang.toLowerCase()}RegimeName`]: new FormControl('', Validators.required) })
      );
      Object.assign(formGroup,
        { prefix: new FormControl('', Validators.required) });
      Object.assign(formGroup,
        { isActive: new FormControl(false) });
      Object.assign(formGroup,
        { measures: this.lookupAvailableMeasures() });
      this.editMeasuresDialogform = this.fb.group(formGroup,
        { validator: EditRegimeMeasuresdialogValidator }
      );
    }
    this.editMeasuresDialogform = this.fb.group(formGroup,
      { validator: EditRegimeMeasuresdialogValidator }
    );
  }

  getStatus(): boolean {
    return this.data.row ? this.data.row.isActive : false;
  }

  getMeasureChecked(measureName): boolean {
    return this.selectedMeasures.indexOf(measureName) >= 0;
  }

  lookupAvailableMeasures(): FormArray {
    const tmp = this.data.allMeasures;
    const checkboxes = tmp.map(
      (option: any) => new FormControl(false, { updateOn: 'blur' })
    );
    return this.fb.array(checkboxes);
  }

  createApplicableMeasures(): FormArray {
    const tmp = this.data.allMeasures;
    const possessingMeasures = this.data.row.measures;
    const checkboxes = tmp.map((option: any) => {
      const checked = possessingMeasures['EN'].indexOf(option['EN'].measureNm) >= 0;
      return new FormControl(checked, { updateOn: 'blur' });
    });
    return this.fb.array(checkboxes);
  }

  updateChkbxArray(measure: string, isChecked: boolean): void {
    console.log('ggg 212 --------', isChecked);
    if (isChecked) {
      this.selectedMeasures.indexOf(measure) === -1 &&
        this.selectedMeasures.push(measure);
    } else {
      this.selectedMeasures = this.selectedMeasures.filter(
        (item) => item !== measure
      );
    }
  }

  updateActiveStatus(isChecked: boolean): void {}

  getSelectedMeasures(): Array<string> {
    return this.selectedMeasures;
  }

  changeLang(lang) {
    this.lang = lang.toLowerCase();
  }

  submit(editMeasuresDialogform) {
    const formValue = editMeasuresDialogform.value;
    const lang = this.data['lang'].toUpperCase();
    let measures = this.selectedMeasures.map((item) => {
      const measure = this.measuresArr.find(
        (item1) => item1['EN'].measureNm === item
      );
      return measure;
    });
    measures = measures.filter(item => item !== undefined);

    if (this.data.row && editMeasuresDialogform.status == 'VALID') {
      const oldRowData = this.data.row;
      const regime = this.data['regimes'].find(
        (item) => item[lang][oldRowData.prefix] === oldRowData['name'][lang]
      );

      let newRegime = {};
      this.data['languageArr'].forEach((key) => {
        newRegime = {
          [key.acronym]: {
            isActive: formValue.isActive,
            [formValue.prefix]: formValue[`${key.acronym.toLowerCase()}RegimeName`],
            measures: measures.map((item) => item[key.acronym].measureNm),
          },
          ...newRegime,
        };
      });

      this.lkupData.upDteRegime({ regime, newRegime }).subscribe((res) => {
        this.dialogRef.close(res.regime);
      });
    } else {
      if (editMeasuresDialogform.status == 'VALID') {
        let newRegime = {};

        this.data['languageArr'].forEach((key) => {
          newRegime = {
            [key.acronym]: {
              isActive: formValue.isActive,
              [formValue.prefix]: formValue[`${key.acronym.toLowerCase()}RegimeName`],
              measures: measures.map((item) => item[key.acronym].measureNm),
            },
            ...newRegime,
          };
        });

        this.lkupData.addRegime({ newRegime }).subscribe((res) => {
          this.dialogRef.close(res.regime);
        });
      } else {
        this.langArr.forEach(lang => {
            if (editMeasuresDialogform.value[lang.toLowerCase() + 'RegimeName'] == '' || editMeasuresDialogform.value[lang.toLowerCase() + 'RegimeName'] == null) {
              this.changeLang(lang);
              return;
            }
          }
        );
      }
    }
  }
}

const EditRegimeMeasuresdialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
};
