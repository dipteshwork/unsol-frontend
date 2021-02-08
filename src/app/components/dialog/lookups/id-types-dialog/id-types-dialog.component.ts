import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { Language } from '../../../../models/languageModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../../classes/lookupLst';

@Component({
  selector: 'app-id-types-dialog',
  templateUrl: './id-types-dialog.component.html',
  styleUrls: ['./id-types-dialog.component.scss'],
})
export class IdTypesDialogComponent implements OnInit {
  languageArr: Language[];
  editDialogform: FormGroup;
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IdTypesDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; lang: string; translations: any },
    private lookupService: AdminService,
    private lookupCollprovider: LookupCollproviderProvider,
  ) {}

  ngOnInit() {
    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    const currentObj = this.data['idType']
      ? this.data['idType']
      : { idTypeName: '', isActive: true };
    this.languageArr = this.data['languageArr'];
    const allArrs = this.data['isEditMode'] ? this.data['idTypes'] : '';
    const subObjects =
      this.data['isEditMode'] &&
      allArrs.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].idTypeName ===
            this.data['idType'].idTypeName
      );

    this.editDialogform = this.fb.group({
      isActive: new FormControl({
        value: currentObj.isActive,
        disabled: false,
      }),
    });

    this.languageArr.forEach((x) => {
      const key = x.acronym.toLowerCase();
      this.editDialogform.addControl(
        `${key.toUpperCase()}_idType`,
        new FormControl(
          this.data['isEditMode'] && subObjects[x.acronym]
            ? subObjects[x.acronym].idTypeName
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
              idTypeName: formValue[`${key.acronym}_idType`],
            },
          },
          newObject
        );
      });

      if (!this.data['isEditMode']) {
        this.lookupService.addIDType(newObject).subscribe((data) => {
          if (data.gender && data.gender.length > 0) {
            this.dialogRef.close({
              ...data,
              idType: [...data.idType, newObject],
            });
          } else {
            this.dialogRef.close({
              ...data,
              idType: [newObject],
            });
          }
        });
      } else {
        const oldData = this.data['idType'];
        const updatedTransData = {
          newObject,
          oldData,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lookupService.updateIDType(updatedTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[`${lang}_idType`] == '' || editDialogform.value[`${lang}_idType`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }

}
