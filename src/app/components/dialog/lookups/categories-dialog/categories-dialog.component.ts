import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../../classes/lookupLst';
import { Language } from '../../../../models/languageModel';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
})
export class CategoriesDialogComponent implements OnInit {
  editDialogform: FormGroup;
  languageArr: Language[];
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriesDialogComponent>,
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
    const currentObj = this.data['idCategory']
      ? this.data['idCategory']
      : { idCategoryName: '', isActive: true };
    this.languageArr = this.data['languageArr'];
    const allArrs = this.data['isEditMode'] ? this.data['idCategories'] : '';
    const subObjects =
      this.data['isEditMode'] &&
      allArrs.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].idCategoryName ===
            this.data['idCategory'].idCategoryName
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
        `${key.toUpperCase()}_idCategory`,
        new FormControl(
          this.data['isEditMode'] && subObjects[x.acronym]
            ? subObjects[x.acronym].idCategoryName
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
              idCategoryName: formValue[`${key.acronym}_idCategory`],
            },
          },
          newObject
        );
      });

      if (!this.data['isEditMode']) {
        this.lookupService.addCategoryType(newObject).subscribe((data) => {
          if (data.idCategory && data.idCategory.length > 0) {
            this.dialogRef.close({
              ...data,
              idCategory: [...data.idCategory, newObject],
            });
          } else {
            this.dialogRef.close({
              ...data,
              idCategory: [newObject],
            });
          }
        });
      } else {
        const oldData = this.data['idCategory'];
        const updatedTransData = {
          newObject,
          oldData,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lookupService.updateCategoryType(updatedTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[`${lang}_idCategory`] == '' || editDialogform.value[`${lang}_idCategory`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }
}