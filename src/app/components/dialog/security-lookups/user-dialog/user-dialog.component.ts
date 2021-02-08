import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { Language } from 'src/app/models/languageModel';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  submitted = false;
  editUserDialogform: FormGroup;
  langArr = [];
  rolesArr = [];
  userRoles = [];
  userLangs = [];
  curLang: string;
  translations = {};

  constructor(
    private fb: FormBuilder,
    private lookupCollprovider: LookupCollproviderProvider,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.lookupCollprovider.getTranslations();
    this.curLang = this.data.appLang.toUpperCase();
    this.langArr = this.data.langArr;
    this.rolesArr = this.data.rolesArr;

    if (this.data.rowData) {
      this.userRoles = this.data.rowData.roles;
      this.userLangs = this.data.rowData.langs;
      this.editUserDialogform = this.editUser();
    } else {
      this.editUserDialogform = this.addUser();
    }
  }

  getChecked(userRole): boolean {
    return this.userRoles.indexOf(userRole) >= 0;
  }

  updateChkbxArray(userRole: string, isChecked: boolean): void {
    if (isChecked) {
      this.userRoles.indexOf(userRole) === -1 &&
        this.userRoles.push(userRole);
    } else {
      this.userRoles = this.userRoles.filter((item) => item !== userRole);
    }
  }

  submit(editUserDialogform) {
    this.submitted = true;

    if (editUserDialogform.invalid) {
      return;
    } else if (editUserDialogform.status == 'VALID' && this.data.rowData) {
      const oldRowData = this.data;
      const modifiedRowData = editUserDialogform.value;

      const data: any = {
        oldRowData: oldRowData,
        userEmail: modifiedRowData['userEmail'],
        userName: modifiedRowData['userName'],
        preferLanguage: modifiedRowData['preferLanguage'],
        roles: this.userRoles,
        isActive: editUserDialogform.value.isActiveUser,
        langs: this.userLangs,
      };

      this.authServ.updateUser(data).subscribe((result) => {
        this.dialogRef.close(result);
      });
    } else if (editUserDialogform.status == 'VALID') {
      const user: User = {
        roles: this.userRoles,
        userEmail: editUserDialogform.value.userEmail,
        userName: editUserDialogform.value.userName,
        preferLanguage: editUserDialogform.value.preferLanguage,
        isActive: editUserDialogform.value.isActiveUser,
        langs: this.userLangs,
      };
      this.authServ.addUser(user).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  switchLang(lang: Language) {
    this.curLang = lang.acronym;
  }

  onNoClick(): void {
    this.submitted = false;
    this.dialogRef.close();
  }

  addUser(): FormGroup {
    return this.fb.group({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userName: new FormControl(''),
      userRoles: new FormControl([], [Validators.minLength(1)]),
      preferLanguage: new FormControl(''),
      isActiveUser: new FormControl(true),
    });
  }

  editUser(): FormGroup {
    return this.fb.group({
      userEmail: new FormControl(this.data.rowData.userEmail, [
        Validators.required,
        Validators.email,
      ]),
      userName: new FormControl(this.data.rowData.userName),
      userRoles: new FormControl(this.data.rowData.roles[0], [
        Validators.minLength(1),
      ]),
      preferLanguage: new FormControl(this.data.rowData.preferLanguage) || '',
      isActiveUser: new FormControl(
        this.data.rowData.isActive
      ),
    });
  }

  createApplicableRolesChkboxes(): string[] {
    const tmp = this.data.rolesArr;

    if (tmp) {
      this.rolesArr = tmp;

      const radioBtns = tmp.map((option: any) => {
        this.userRoles.push(option['roleName']);
      });
      return radioBtns;
    } else {
      return null;
    }
  }

  lookupAvailableRolesChkboxe(): string {
    const tmp = this.data.rolesArr;

    if (tmp) {
      tmp[0]['roles'].map((option: any) => {
        if (this.data.rowData.roles.includes(option['roleName'])) {
          return option['roleName'];
        } else {
          return '';
        }
      });

      this.rolesArr = tmp[0]['roles'];
      return '';
    } else {
      return null;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.editUserDialogform.controls;
  }

  isUserHasRole(role) {
    return this.userRoles.some(item => item === role);
  }

  getCheckedLang(lang: string): boolean {
    return this.userLangs && this.userLangs.indexOf(lang) >= 0;
  }

  updateLang(lang: string, isChecked: boolean): void {
    if (isChecked) {
      this.userLangs.indexOf(lang) === -1 && this.userLangs.push(lang);
    } else {
      this.userLangs = this.userLangs.filter((item) => item !== lang);
    }
  }

  getTranslation(str) {
    return this.translations[this.curLang.toLowerCase()][str] || str;
  }
}
