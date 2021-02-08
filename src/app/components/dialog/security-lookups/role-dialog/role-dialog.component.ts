import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {AuthService} from '../../../../services/auth.service';
import {Role} from '../../../../interfaces/role';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';


@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {
  editRoleDialogform: FormGroup;
  translations = {};
  lang: string;

  constructor(
    private fb: FormBuilder,
    private lookupCollprovider: LookupCollproviderProvider,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private authServ: AuthService) {
  }

  ngOnInit() {
    this.translations = this.lookupCollprovider.getTranslations();
    this.lang = this.authServ.getPreferLang();
    console.log('the data being edited is ', this.data);
    this.editRoleDialogform = this.ediRole();
  }


  ediRole(): FormGroup {
    return this.fb.group({
      roleNm: this.data.rowData == null ? '' : this.data.rowData.roleName,
      roleDescr: this.data.rowData == null ? '' : this.data.rowData.roleDescription,
      roleWeight: this.data.rowData == null ? '' : this.data.rowData.roleWeight
    }, {validator: EditRoleDialogValidator});
  }

  /*
  let index = this.dataSource.filteredData.indexOf(row);  // need the index of the row from the data source we clicked on
        this.dataSource.filteredData[index]['roles'] = result.roles;
  */
  submit(editRoleDialogform) {
    if (editRoleDialogform.status == 'VALID' && this.data.rowData) {

      console.log('Now about to update with the Roles  dialog info is', editRoleDialogform.value);

      const oldRowData = this.data;
      const modifiedRowData = editRoleDialogform.value;
      console.log('the old data is ', oldRowData, ' while the modified data is ', modifiedRowData);
      const dta: any = {'oldRowData': oldRowData, 'modifiedRowData': modifiedRowData};

      const result = null;
      this.authServ.updateRole(dta).subscribe(dta => {
        console.log('the result is ' + dta);
        this.dialogRef.close(dta);
      });
    } else if (editRoleDialogform.status == 'VALID') { // here we will be adding a new Role

      const role: Role = {'roleName': editRoleDialogform.value.roleNm, 'roleDescription': editRoleDialogform.value.roleDescr, 'roleWeight': editRoleDialogform.value.roleWeight};
      console.log('here we will be adding a new role ' + role.roleName);
      this.authServ.addRole(role).subscribe(dta => {
        console.log('the result is ' + dta);
        this.dialogRef.close(dta);
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

const EditRoleDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
  /*
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true}
    : null;
  */
};

