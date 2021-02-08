import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-title-dialog',
  templateUrl: './title-dialog.component.html',
  styleUrls: ['./title-dialog.component.scss'],
})
export class TitleDialogComponent implements OnInit {
  titleDialogForm: FormGroup;
  lang: string;
  translations: {};
  isInvalid = false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TitleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.titleDialogForm = this.fb.group({
      title: this.data.editTitle == null ? '' : this.data.editTitle,
    });
    if (this.data.isReadOnly) {
      this.titleDialogForm.disable();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(titleDialogForm) {
    if (titleDialogForm.value.title) {
      const result = titleDialogForm.value;
      this.dialogRef.close(result);
    } else {
      this.isInvalid = true;
    }
  }
}
