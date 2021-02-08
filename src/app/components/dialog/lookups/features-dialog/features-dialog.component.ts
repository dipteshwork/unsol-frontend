import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../../classes/lookupLst';

@Component({
  selector: 'app-features-dialog',
  templateUrl: './features-dialog.component.html',
  styleUrls: ['./features-dialog.component.scss'],
})
export class FeaturesDialogComponent implements OnInit {
  editDialogform: FormGroup;
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FeaturesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string, lang: string, translations: any },
    private lkupData: AdminService,
    private lookupCollprovider: LookupCollproviderProvider,
  ) {}

  ngOnInit() {
    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    const originalData = this.data['row'] ? this.data['row'] : {};
    const formGroup = {};
    if (this.data['row']) {
      this.langArr.map(
        lang => Object.assign(formGroup,
          {
            [`${lang.toLowerCase()}Feature`]: new FormControl(originalData['features'][lang], Validators.required),
            isActive: new FormControl(originalData['features']['isActive'])
          })
      );
    } else {
      this.langArr.map(
        lang => Object.assign(formGroup,
          { [`${lang.toLowerCase()}Feature`]: new FormControl('', Validators.required),
            isActive: new FormControl(false)
          })
      );
    }
    this.editDialogform = this.fb.group(formGroup);
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(editDialogform) {
    if (editDialogform.status === 'VALID') {
      const newData = editDialogform.value;

      if (!this.data['row']) {
        this.lkupData.addFeature(newData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      } else {
        const oldData = this.data['row']['features'];
        const newTransData = { newFeature: newData, oldFeature: oldData };
        this.lkupData.updateFeature(newTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[lang.toLowerCase() + 'Feature'] == '' || editDialogform.value[lang.toLowerCase() + 'Feature'] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }
}
