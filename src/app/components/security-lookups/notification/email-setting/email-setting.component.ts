import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { AuthService } from '../../../../services/auth.service';
import { NotiEmailDialogComponent } from '../../../dialog/security-lookups/noti-email-dialog/noti-email-dialog.component';
import { EmailNotificationService } from 'src/app/services/email-notification.service';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { SecurityLookupsDeleteDialogComponent } from '../../../dialog/security-lookups/delete-dialog/delete-dialog.component';
import { NotificationEmail } from '../../../../models/email-notification/notificationModel';

@Component({
  selector: 'app-email-setting',
  templateUrl: './email-setting.component.html',
  styleUrls: ['./email-setting.component.scss'],
})
export class EmailSettingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'position',
    'emailType',
    'emailTitle',
    'emailDescription',
    'delete',
  ];
  editNotiEmailDialogRef: MatDialogRef<NotiEmailDialogComponent>;
  deleteDialogRef: MatDialogRef<SecurityLookupsDeleteDialogComponent>;
  dataSource = new MatTableDataSource();
  originalData: any;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  translations = {};
  lookupLst$: any;
  langArr: any;
  lang: string;

  constructor(
    private lookupCollprovider: LookupCollproviderProvider,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private authServ: AuthService,
    private emailServ: EmailNotificationService
  ) {}

  ngOnInit() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupLst$['language'];
    this.lang = this.authServ.getPreferLang();
    this.emailServ.getNotiEmail().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  rowClicked(row: any, $event: any): void {
    if (
      Array.from($event.path[0].classList).includes('cdk-column-delete') ||
      Array.from($event.path[1].classList).includes('cdk-column-delete') ||
      Array.from($event.path[2].classList).includes('cdk-column-delete')
    ) {
      this.openDeleteDialog(row);
    } else {
      this.openNotiEmailDialog(row);
    }
  }

  openDeleteDialog(row: any): void {
    if (this.deleteDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(SecurityLookupsDeleteDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        type: 'email setting notification',
        title: 'Delete Notification',
        emailTitle: row.emailTitle,
        appLang: this.lang,
        langArr: this.langArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: NotificationEmail) => {
      if (result) {
        const tmpData = this.dataSource.data.filter((item) => {
          return item['emailTitle'] !== result.emailTitle || '';
        });
        this.dataSource.data = tmpData;
      }
      this.deleteDialogRef = null;
    });

    this.deleteDialogRef = dialogRef;
  }

  openNotiEmailDialog(row: any): void {
    if (this.editNotiEmailDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(NotiEmailDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Edit Notification', rowData: row },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = result.value;
        this.cd.detectChanges();
      }
      this.editNotiEmailDialogRef = null;
    });
    this.editNotiEmailDialogRef = dialogRef;
  }

  addNotiEmailDialog(): void {
    const dialogRef = this.dialog.open(NotiEmailDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Add New Notification', rowData: null },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const tmpData = this.dataSource.data;
        tmpData.push(result);
        this.dataSource.data = tmpData;
        this.cd.detectChanges();
      }
    });
    this.editNotiEmailDialogRef = dialogRef;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.emailServ.getNotiEmail(filterValue).subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()]
      ? this.translations[this.lang.toLowerCase()][str]
      : str;
  }
}
