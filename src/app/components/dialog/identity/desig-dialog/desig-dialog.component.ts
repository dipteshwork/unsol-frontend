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
  selector: 'app-desig-dialog',
  templateUrl: './desig-dialog.component.html',
  styleUrls: ['./desig-dialog.component.scss'],
})
export class DesigDialogComponent implements OnInit {
  desigDialogForm: FormGroup;
  isInvalid = false;
  lang: string;
  translations: {};
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DesigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.desigDialogForm = this.fb.group({
      designation: this.data.editDesig == null ? '' : this.data.editDesig,
    });
    if (this.data.isReadOnly) {
      this.desigDialogForm.disable();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(desigDialogForm) {
    if (!desigDialogForm.value.designation) {
      this.isInvalid = true;
      return;
    }

    const result = desigDialogForm.value;
    this.dialogRef.close(result);
  }
}
