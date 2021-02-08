import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../interfaces/role';
import { RoleDialogComponent } from '../../dialog/security-lookups/role-dialog/role-dialog.component';
import { SecurityLookupsDeleteDialogComponent } from '../../dialog/security-lookups/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-roles-lk',
  templateUrl: './roles-lk.component.html',
  styleUrls: ['./roles-lk.component.scss'],
})
export class RolesLkComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'position',
    'roleName',
    'roleDescription',
    'roleWeight',
    'delete',
  ];
  dataSource = new MatTableDataSource();
  addRoleDialogRef: MatDialogRef<RoleDialogComponent>;
  editRolesDialogRef: MatDialogRef<RoleDialogComponent>;
  deleteDialogRef: MatDialogRef<SecurityLookupsDeleteDialogComponent>;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  translations = {};
  lookupLst$: any;
  langArr: any;
  lang: string;

  constructor(private dialog: MatDialog, private authServ: AuthService) {}

  ngOnInit() {
    this.authServ.getRoles().subscribe((data) => {
      this.dataSource.data = data;
    });
    this.lang = this.authServ.getPreferLang();
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
      this.openDeleteRoleDialog(row);
    } else {
      this.openRoleDialog(row);
    }
  }

  openRoleDialog(row: any): void {
    if (this.editRolesDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Edit Role', rowData: row },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: [Role]) => {
      if (result) {
        this.dataSource.data = result;
      }
      this.editRolesDialogRef = null;
    });
    this.editRolesDialogRef = dialogRef;
  }

  addRoleDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Add New Role', rowData: null },
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe((result: [Role]) => {
      if (result) {
        this.dataSource.data = result;
      }
    });
    this.addRoleDialogRef = dialogRef;
  }

  openDeleteRoleDialog(row: any): void {
    if (this.deleteDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(SecurityLookupsDeleteDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        type: 'role',
        title: 'Delete Role',
        roleName: row.roleName,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: [Role]) => {
      if (result) {
        this.dataSource.data = result;
      }
      this.deleteDialogRef = null;
    });

    this.deleteDialogRef = dialogRef;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.authServ.getRoles(filterValue).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()]
      ? this.translations[this.lang.toLowerCase()][str]
      : str;
  }
}
