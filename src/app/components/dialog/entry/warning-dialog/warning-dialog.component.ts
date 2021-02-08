import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent implements OnInit {
  langArr = [];
  curLang: string;

  constructor(
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {
    this.curLang = this.data.appLang.toUpperCase();
    this.langArr = this.data.langArr;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleClick(): void {
    this.dialogRef.close(true);
  }
}
