import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss'],
})
export class RemoveDialogComponent implements OnInit {
  removeSanctionForm: FormGroup;
  translations: {};
  lang: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.removeSanctionForm = this.fb.group({
      deleteComment: new FormControl(''),
      sanctionId: new FormControl(this.data['sanctionId']),
    });
  }

  submit(removeSanctionForm) {
    this.dialogRef.close(removeSanctionForm);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
