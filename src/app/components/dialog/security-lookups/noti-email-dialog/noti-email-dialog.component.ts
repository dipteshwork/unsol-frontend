import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup,
  ValidatorFn, Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import { NotificationEmail } from '../../../../models/email-notification/notificationModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-noti-email-dialog',
  templateUrl: './noti-email-dialog.component.html',
  styleUrls: ['./noti-email-dialog.component.scss'],
})
export class NotiEmailDialogComponent implements OnInit {
  editNotiEmailDialogform: FormGroup;
  translations = {};
  lang: string;

  constructor(
    private fb: FormBuilder,
    private lookupCollprovider: LookupCollproviderProvider,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<NotiEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailServ: EmailNotificationService,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.lookupCollprovider.getTranslations();
    this.lang = this.authServ.getPreferLang();
    console.log('the data being edited is ', this.data);
    this.editNotiEmailDialogform = this.editNotiEmail();
  }

  editNotiEmail(): FormGroup {
    return this.fb.group(
      {
        emailType: new FormControl(this.data.rowData == null ? '' : this.data.rowData.emailType, [
          Validators.required,
        ]),
        emailTitle: new FormControl(this.data.rowData == null ? '' : this.data.rowData.emailTitle, [
          Validators.required,
        ]),
        emailDescription: new FormControl(this.data.rowData == null ? '' : this.data.rowData.emailDescription, [
          Validators.required,
        ]),
      },
    );
  }

  submit(editNotiEmailDialogform) {
    if (editNotiEmailDialogform.invalid) {
      return;
    } else if (editNotiEmailDialogform.status === 'VALID' && this.data.rowData) {
      const oldRowData = this.data;
      const modifiedRowData = editNotiEmailDialogform.value;
      const dta: any = {
        oldRowData: oldRowData,
        emailType: modifiedRowData['emailType'],
        emailTitle: modifiedRowData['emailTitle'],
        emailDescription: modifiedRowData['emailDescription'],
      };

      this.emailServ.updateNotiEmail(dta).subscribe((result) => {
        this.dialogRef.close(result);
      });
    } else if (editNotiEmailDialogform.status === 'VALID') {
      const usr: NotificationEmail = {
        emailType: editNotiEmailDialogform.value.emailType,
        emailTitle: editNotiEmailDialogform.value.emailTitle,
        emailDescription: editNotiEmailDialogform.value.emailDescription,
      };
      this.emailServ.addNotiEmail(usr).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()][str] || str;
  }
}

const EditDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
  /*
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true}
    : null;
  */
};
