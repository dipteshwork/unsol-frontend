import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
  styleUrls: ['./user-delete-dialog.component.scss'],
})
export class UserDeleteDialogComponent implements OnInit {
  langArr = [];
  rolesArr = [];
  curLang: string;

  constructor(
    public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.curLang = this.data.appLang.toUpperCase();
    this.langArr = this.data.langArr;
    this.rolesArr = this.data.rolesArr;
  }

  delete() {
    const data: any = {
      userEmail: this.data.userEmail,
    };
    this.authServ.deleteUser(data).subscribe((result) => {
      this.dialogRef.close(result);
    });
  }

  handleClick(): void {
    this.dialogRef.close();
  }
}
