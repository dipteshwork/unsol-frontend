import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { Language } from '../../../../models/languageModel';
import { LookupLst } from '../../../../classes/lookupLst';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';

@Component({
  selector: 'app-living-status-dialog',
  templateUrl: './living-status-dialog.component.html',
  styleUrls: ['./living-status-dialog.component.scss'],
})
export class LivingStatusDialogComponent implements OnInit {
  languageArr: Language[];
  editDialogform: FormGroup;
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LivingStatusDialogComponent>,
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
    const currentObj = this.data['livingStatus']
      ? this.data['livingStatus']
      : { livingStatusName: '', isActive: true };
    this.languageArr = this.data['languageArr'];
    const allArrs = this.data['isEditMode'] ? this.data['livingStatuses'] : '';
    const subObjects =
      this.data['isEditMode'] &&
      allArrs.find(
        (item) =>
          item[this.data['lang'].toUpperCase()] &&
          item[this.data['lang'].toUpperCase()].livingStatusName ===
            this.data['livingStatus'].livingStatusName
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
        `${key.toUpperCase()}_livingStatus`,
        new FormControl(
          this.data['isEditMode'] && subObjects[x.acronym]
            ? subObjects[x.acronym].livingStatusName
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
              livingStatusName: formValue[`${key.acronym}_livingStatus`],
            },
          },
          newObject
        );
      });

      if (!this.data['isEditMode']) {
        this.lookupService.addLivingStatus(newObject).subscribe((data) => {
          if (data.livingStatus && data.livingStatus.length > 0) {
            this.dialogRef.close({
              ...data,
              livingStatus: [...data.livingStatus, newObject],
            });
          } else {
            this.dialogRef.close({
              ...data,
              livingStatus: [newObject],
            });
          }
        });
      } else {
        const oldData = this.data['livingStatus'];
        const updatedTransData = {
          newObject,
          oldData,
          lang: this.data['lang'].toUpperCase(),
        };

        this.lookupService.updateLivingStatus(updatedTransData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    } else {
      this.langArr.forEach(lang => {
          if (editDialogform.value[`${lang}_livingStatus`] == '' || editDialogform.value[`${lang}_livingStatus`] == null) {
            this.changeLang(lang);
            return;
          }
        }
      );
    }
  }

  // submit(editDialogform) {
  //   if (editDialogform.status === 'VALID') {
  //     const newData = editDialogform.value;

  //     if (!this.data['row']) {
  //       this.lkupData.addLivingStatus(newData).subscribe((data) => {
  //         this.dialogRef.close(data);
  //       });
  //     } else {
  //       const oldData = this.data['row']['livingStatus'];
  //       const newTransData = {
  //         newLivingStatus: newData,
  //         oldLivingStatus: oldData,
  //       };
  //       this.lkupData.updateLivingStatus(newTransData).subscribe((data) => {
  //         this.dialogRef.close(data);
  //       });
  //     }
  //   } else {
  //     this.langArr.forEach(lang => {
  //         if (editDialogform.value[lang.toLowerCase() + 'LivingStatus'] == '' || editDialogform.value[lang.toLowerCase() + 'LivingStatus'] == null) {
  //           this.changeLang(lang);
  //           return;
  //         }
  //       }
  //     );
  //   }
  // }
}
