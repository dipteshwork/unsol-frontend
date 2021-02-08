import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces/user';
import { Regime } from 'src/app/models/regimesModel';
import { Receiver } from 'src/app/models/email-notification/receiverModel';
import { ReceiverDialogComponent } from '../../../dialog/security-lookups/receiver-dialog/receiver-dialog.component';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import {SecurityLookupsDeleteDialogComponent} from '../../../dialog/security-lookups/delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-receiver-setting',
  templateUrl: './receiver-setting.component.html',
  styleUrls: ['./receiver-setting.component.scss'],
})
export class ReceiverSettingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = ['position', 'userName', 'userEmail', 'roles', 'langs', 'regimes', 'delete'];
  editReceiverDialogRef: MatDialogRef<ReceiverDialogComponent>;
  addReceiverDialogRef: MatDialogRef<ReceiverDialogComponent>;
  deleteDialogRef: MatDialogRef<SecurityLookupsDeleteDialogComponent>;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  DIALOG_MD: string = window.screen.width > 768 ? '60%' : '80%';
  dataSource: any;
  originalData: any;
  users: User[];
  rolesData: any;
  lookupLst$: any;
  regimes: Regime[];
  langArr: any;
  lang = 'EN';
  translations = {};

  constructor(
    private lookupCollprovider: LookupCollproviderProvider,
    private dialog: MatDialog,
    private authServ: AuthService,
    private emailServ: EmailNotificationService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.initialiseInvites();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initialiseInvites() {
    this.authServ.getRoles().subscribe((roleData) => {
      this.rolesData = roleData;
    });

    this.authServ.getUsers().then((data: User[]) => {
      this.users = data;
    });

    this.lang = this.authServ.getPreferLang();

    this.loadReceivers();
  }

  loadReceivers() {
    this.emailServ.getReceivers().subscribe((data: Receiver[]) => {
      this.dataSource = new MatTableDataSource<Receiver>(data);
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  rowClicked(row: any, $event: any): void {
    if (Array.from($event.path[0].classList).includes('cdk-column-delete') ||
      Array.from($event.path[1].classList).includes('cdk-column-delete') ||
      Array.from($event.path[2].classList).includes('cdk-column-delete')) {
      this.openDeleteDialog(row);
    } else {
      this.editReceiverDialog(row);
    }
  }

  handleCheckActiveUser($event: any): void {
    const checkActivity = $event.target.checked;
    if (checkActivity) {
      const oldData = this.dataSource.data;
      const newData = oldData.filter(
        (item) => !item.activationHistory[0].isActive
      );
      this.dataSource.data = newData;
      this.dataSource._updateChangeSubscription();
    } else {
      const newDataSource = this.originalData;
      this.dataSource.data = newDataSource;
      this.dataSource._updateChangeSubscription();
    }
  }

  editReceiverDialog(row: any): void {
    if (this.editReceiverDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(ReceiverDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit Receiver',
        rowData: row,
        rolesArr: this.rolesData,
        appLang: this.lang,
        langArr: this.langArr,
        users: this.users,
        regimes: this.regimes,
      },
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadReceivers();
      }
      this.editReceiverDialogRef = null;
    });
    this.editReceiverDialogRef = dialogRef;
  }

  addReceiverDialog(): void {
    const receiverEmails = this.originalData.map(item => item.userEmail);

    const dialogRef = this.dialog.open(ReceiverDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Add Receiver',
        rolesArr: this.rolesData,
        workingMainLanguage: this.lang,
        appLang: this.lang,
        langArr: this.langArr,
        users: this.users.filter(item => !receiverEmails.includes(item.userEmail)),
        regimes: this.regimes,
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
    this.addReceiverDialogRef = dialogRef;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.emailServ.getReceivers(filterValue).subscribe((data: Receiver[]) => {
      this.dataSource = new MatTableDataSource<Receiver>(data);
      this.originalData = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()] ? this.translations[this.lang.toLowerCase()][str] : str;
  }

  openDeleteDialog(row: any): void {
    if (this.deleteDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(SecurityLookupsDeleteDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        type: 'receiver setting notification',
        title: 'Delete Notification',
        userEmail: row.userEmail,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: Receiver) => {
      if (result) {
        const tmpData = this.dataSource.data.filter(item => {
          return item.userEmail !== result.userEmail;
        });
        this.dataSource.data = tmpData;
      }
      this.deleteDialogRef = null;
    });

    this.deleteDialogRef = dialogRef;
  }
}
