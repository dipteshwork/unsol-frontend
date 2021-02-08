import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { Language } from '../../../../models/languageModel';

@Component({
  selector: 'app-translations-dialog',
  templateUrl: './translations-dialog.component.html',
  styleUrls: ['./translations-dialog.component.scss'],
})
export class TranslationsDialogComponent implements OnInit {
  editTranslationsDialogform: FormGroup;
  languageArr: Language[];
  lang: string;
  translations: {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TranslationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; lang: string; translations: any },
    private lkupData: AdminService
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.languageArr = this.data['languageArr'];
    const originalTranslationData = this.data['row'] ? this.data['row'] : [];
    this.editTranslationsDialogform = this.fb.group({
      ...originalTranslationData,
    });
    this.languageArr.forEach((x) => {
      const key = x.acronym.toLowerCase();
      this.editTranslationsDialogform.addControl(key, new FormControl('', [
        Validators.required,
      ]));
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(editTranslationsDialogform) {
    if (editTranslationsDialogform.status === 'VALID') {
      const translationData = editTranslationsDialogform.value;

      if (!this.data['row']) {
        this.lkupData.addTranslation(translationData).subscribe((data) => {
          this.dialogRef.close(data);
        });
      } else {
        const oldTranslation = this.data['row'];
        const newTranslation = {
          translation: translationData,
          oldTranslation: oldTranslation,
        };
        this.lkupData.updateTranslation(newTranslation).subscribe((data) => {
          this.dialogRef.close(data);
        });
      }
    }
  }
}
