import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../../../../services/auth.service';
import {EmailNotificationService} from '../../../../services/email-notification.service';

@Component({
  selector: 'app-security-lookups-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class SecurityLookupsDeleteDialogComponent implements OnInit {
  langArr = [];
  rolesArr = [];
  curLang: string;
  type: string;

  constructor(
    public dialogRef: MatDialogRef<SecurityLookupsDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private authServ: AuthService,
    private emailServ: EmailNotificationService,
  ) {}

  ngOnInit() {
    this.type = this.data.type;
    this.curLang = this.data.appLang.toUpperCase();
    this.langArr = this.data.langArr;
  }

  delete() {
    let data: any;
    if (this.type === 'role') {
      data = {
        name: this.data.roleName
      };
      this.authServ.deleteRole(data).subscribe((result) => {
        this.dialogRef.close(result);
      });
    } else if (this.type === 'receiver setting notification') {
      data = {
        userEmail: this.data.userEmail
      };
      this.emailServ.deleteReceiver(data).subscribe((result) => {
        this.dialogRef.close(result);
      });
    } else if (this.type === 'email setting notification') {
      data = {
        emailTitle: this.data.emailTitle
      };
      this.emailServ.deleteNotiEmail(data).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  handleClick(): void {
    this.dialogRef.close();
  }
}
