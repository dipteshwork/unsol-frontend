import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { User } from '../../../../interfaces/user';
import { Regime } from 'src/app/models/regimesModel';
import { Receiver } from 'src/app/models/email-notification/receiverModel';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';


@Component({
  selector: 'app-receiver-dialog',
  templateUrl: './receiver-dialog.component.html',
  styleUrls: ['./receiver-dialog.component.scss'],
})
export class ReceiverDialogComponent implements OnInit {
  editUserDialogform: FormGroup;
  submitted: boolean = false;
  allRoles = [];
  allLangs = [];
  regimes: Regime[] = [];

  // information for selected user
  userRoles: string[] = [];
  userLangs: string[] = [];
  userRegimes: string[] = [];
  curUser: any = { roles: [], langs: [] };
  curLang: string = "en";

  userControl = new FormControl();
  users: User[];
  filteredOptions: Observable<User[]>;
  translations = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReceiverDialogComponent>,
    private lookupCollprovider: LookupCollproviderProvider,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailServ: EmailNotificationService
  ) { }

  ngOnInit() {
    this.translations = this.lookupCollprovider.getTranslations();
    this.curLang = this.data.appLang.toUpperCase();
    this.allLangs = this.data.langArr;
    this.allRoles = this.data.rolesArr;
    this.users = this.data.users;
    this.regimes = this.data.regimes;

    if (this.data.rowData) {
      this.curUser = this.data.users.find(item => item.userEmail == this.data.rowData.userEmail) || {};
      this.userRoles = this.data.rowData.roles || [];
      this.userLangs = this.data.rowData.langs || [];
      this.userRegimes = this.data.rowData.regimes || [];
      this.editUserDialogform = this.editUser();
    } else {
      this.editUserDialogform = this.addUser();
    }

    this.filteredOptions = this.userControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(
      (user) => user.userEmail.toLowerCase().indexOf(filterValue) === 0
    );
  }

  getCheckedRole(userRole: string): boolean {
    return this.userRoles && this.userRoles.indexOf(userRole) >= 0;
  }

  getCheckedLang(lang: string): boolean {
    return this.userLangs && this.userLangs.indexOf(lang) >= 0;
  }

  getCheckedRegime(regime: string): boolean {
    return this.userRegimes && this.userRegimes.indexOf(this.getRegimeValue(regime)) >= 0;
  }

  updateRegime(regime: string, isChecked: boolean): void {
    const regimeName = this.getRegimeValue(regime);
    if (isChecked) {
      this.userRegimes.indexOf(regimeName) === -1 && this.userRegimes.push(regimeName);
    } else {
      this.userRegimes = this.userRegimes.filter((item) => item !== regimeName);
    }
  }

  updateLang(lang: string, isChecked: boolean): void {
    if (isChecked) {
      this.userLangs.indexOf(lang) === -1 && this.userLangs.push(lang);
    } else {
      this.userLangs = this.userLangs.filter((item) => item !== lang);
    }
  }

  submit(editUserDialogform) {
    this.submitted = true;

    if (this.isInValidRegimeInput() || this.isInValidLangInput()) {
      return;
    }

    if (this.data.rowData) {
      const userEmail = editUserDialogform.value.userEmail;
      const userName = this.users.find(item => item.userEmail == userEmail).userName;

      const receiver: Receiver = {
        roles: this.userRoles,
        userEmail,
        userName,
        langs: this.userLangs,
        regimes: this.userRegimes,
      };

      this.emailServ.updateReceiver(receiver).subscribe((result: Receiver) => {
        this.dialogRef.close(result);
      });
    } else {
      const userEmail = this.curUser.userEmail;
      const userName = this.users.find(item => item.userEmail == userEmail).userName;

      const receiver: Receiver = {
        roles: this.userRoles,
        userEmail,
        userName,
        langs: this.userLangs,
        regimes: this.userRegimes,
      };

      this.emailServ.addReceiver(receiver).subscribe((result: Receiver) => {
        this.dialogRef.close(result);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUser(): FormGroup {
    return this.fb.group({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userRoles: new FormControl([], [Validators.minLength(1)]),
      langs: new FormControl([]),
    });
  }

  editUser(): FormGroup {
    return this.fb.group({
      userEmail: new FormControl(this.data.rowData.userEmail, [
        Validators.required,
        Validators.email,
      ]),
      userRoles: new FormControl(this.data.rowData.roles[0], [
        Validators.minLength(1),
      ]),
      langs: new FormControl(this.data.rowData.langs) || [],
    });
  }

  getRegimeValue(obj: {}): string {
    const key = Object.keys(obj).find(
      (item) => item !== 'isActive' && item !== 'measures'
    );
    return obj[key];
  }

  isUserHasRole(role) {
    return this.userRoles.some(item => item === role);
  }

  isInValidRegimeInput() {
    return this.isUserHasRole('Secretary') && this.userRegimes.length === 0;
  }

  isInValidLangInput() {
    return this.isUserHasRole('Translator') && this.userLangs.length === 0;
  }

  onChangeEmail(email: string) {
    this.curUser = this.users.find(item => item.userEmail === email);
    this.userRoles = this.curUser.roles;
  }

  getTranslation(str) {
    return this.translations[this.curLang.toLowerCase()][str] || str;
  }
}
