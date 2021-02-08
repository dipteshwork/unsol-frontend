import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';
import { UserDialogComponent } from '../../dialog/security-lookups/user-dialog/user-dialog.component';
import { UserDeleteDialogComponent } from '../../dialog/security-lookups/user-delete-dialog/user-delete-dialog.component';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';

@Component({
  selector: 'app-users-lk',
  templateUrl: './users-lk.component.html',
  styleUrls: ['./users-lk.component.scss'],
})
export class UsersLkComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'position',
    'roles',
    'userEmail',
    'isActiveUser',
    'delete',
  ];
  editUsersDialogRef: MatDialogRef<UserDialogComponent>;
  deleteUsersDialogRef: MatDialogRef<UserDeleteDialogComponent>;
  addUserDialogRef: MatDialogRef<UserDialogComponent>;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  DIALOG_MD: string = window.screen.width > 768 ? '60%' : '80%';
  dataSource: any;
  originalData: any;
  rolesData: any;
  lookupLst$: any;
  langArr: any;
  lang = 'EN';
  translations = {};

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authServ: AuthService,
    private lookupCollprovider: LookupCollproviderProvider,
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupLst$['language'];

    this.authServ.getRoles().subscribe((roleData) => {
      this.rolesData = roleData;
    });

    this.authServ.getUsers().then((data: [User]) => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  populateFormWSanctionData(isAmend: boolean) {
    if (!this.lang) {
      this.lang = this.router.url.substr(-2);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowClicked(row: any, $event: any): void {
    if (
      Array.from($event.path[0].classList).includes('cdk-column-delete') ||
      Array.from($event.path[1].classList).includes('cdk-column-delete') ||
      Array.from($event.path[2].classList).includes('cdk-column-delete')
    ) {
      this.openDeleteUsersDialog(row);
    } else {
      this.openEditUsersDialog(row);
    }
  }

  handleCheckActiveUser($event: any): void {
    const checkActivity = $event.checked;

    if (checkActivity) {
      const oldData = this.dataSource.data;
      const newData = oldData.filter((item) => item.isActive);
      this.dataSource.data = newData;
      this.dataSource._updateChangeSubscription();
    } else {
      const newDataSource = this.originalData;
      this.dataSource.data = newDataSource;
      this.dataSource._updateChangeSubscription();
    }
  }

  openEditUsersDialog(row: any): void {
    if (this.editUsersDialogRef != null) {
      return;
    }

    const rowData = JSON.parse(JSON.stringify(row));
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit User',
        rowData: rowData,
        rolesArr: this.rolesData,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        const index = this.dataSource.filteredData.indexOf(row);
        this.dataSource.filteredData[index]['roles'] = result.roles;
        this.dataSource.filteredData[index]['userEmail'] = result.userEmail;
        this.dataSource.filteredData[index]['userName'] = result.userName;
        this.dataSource.filteredData[index].isActive = result.isActive;

        if (
          this.dataSource.filteredData[index]['preferLanguage'] !==
          result.preferLanguage
        ) {
          this.dataSource.filteredData[index]['preferLanguage'] =
            result.preferLanguage;
          // window.location.reload();
        }
      } else {
        const index = this.dataSource.filteredData.indexOf(row);
      }
      this.editUsersDialogRef = null;
    });

    this.editUsersDialogRef = dialogRef;
  }

  openDeleteUsersDialog(row: any): void {
    if (this.deleteUsersDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Delete User',
        userEmail: row.userEmail,
        rolesArr: this.rolesData,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        const tmpData = this.dataSource.data.filter((item) => {
          return item.userEmail !== result.userEmail;
        });
        this.dataSource.data = tmpData;
      }
      this.deleteUsersDialogRef = null;
    });

    this.deleteUsersDialogRef = dialogRef;
  }

  addUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Add New User',
        rolesArr: this.rolesData,
        workingMainLanguage: this.lang,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        const tmpData = this.dataSource.data;
        tmpData.push(result);
        this.dataSource.data = tmpData;
      }
    });

    this.addUserDialogRef = dialogRef;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.authServ.getUsers(filterValue).then((data: [User]) => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()]
      ? this.translations[this.lang.toLowerCase()][str]
      : str;
  }

  arrayToString(arr) {
    return arr.toString().replace(/,/g, ', ');
  }
}
