import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { LivingStatusDialogComponent } from '../../dialog/lookups/living-status-dialog/living-status-dialog.component';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-livingstat-lk',
  templateUrl: './livingstat-lk.component.html',
  styleUrls: ['./livingstat-lk.component.scss'],
})
export class LivingstatLkComponent implements OnInit, AfterViewInit {
  result: any;
  livStatuArr: any;
  displayedColumns: string[] = ['position', 'livingStatus', 'status', 'delete'];
  dataSource = new MatTableDataSource();
  lkupRegimeForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  translations = {};
  public lookupLst$: LookupLst;
  public activities$: Observable<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService,
    private adminService: AdminService,
  ) {}

  ngOnInit() {

    this.loadLookup();
    this.getLivingStatus();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getLivingStatus() {
    this.dataSource.data = this.lookupLst$['livingStatus'].map(
      (item) => item[this.appLang.toUpperCase()]
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(form: FormGroup) {
    this.adminService
    .addEntryTyp({ entryTypeName: form.value['livingStatus'], isActive: true, prefix: 1, })
    .subscribe((data) => {
    });
  }

  rowClicked(row: any, i: number): void {
    this.editLivingStatusTypDialog(row, i);
  }

  loadLookup() {
    this.livStatuArr = this.lookupCollprovider.lookupColl.livingStatus;

    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'livingStatus').then(() => {
      this.loadLookup();
      this.getLivingStatus();
      const output = this.livStatuArr.map((val, index) => ({
        livingStatusName: val && val[this.appLang.toUpperCase()].livingStatusName,
        isActive: val && val[this.appLang.toUpperCase()].isActive,
      }));
      this.dataSource = new MatTableDataSource(output);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editLivingStatusTypDialogRef: MatDialogRef<LivingStatusDialogComponent>;
  editLivingStatusTypDialog(row: any, i: number): void {
    if (this.editLivingStatusTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(LivingStatusDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Living Status',
        livingStatus: row,
        livingStatuses: this.lookupLst$['livingStatus'],
        languageArr: this.lookupLst$['language'],
        isEditMode: true,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.applyFilter('');
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.livingStatus.map(
          (item) => item[this.appLang.toUpperCase()]
        );
        this.lookupLst$ = result;
      }
      this.editLivingStatusTypDialogRef = null;
    });
    this.editLivingStatusTypDialogRef = dialogRef;
  }

  newLivingStatusTyp() {
    this.openAddLivingStatusTypDialog();
  }

  addLivingStatusTypDialogRef: MatDialogRef<LivingStatusDialogComponent>;
  openAddLivingStatusTypDialog(): void {
    if (this.addLivingStatusTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(LivingStatusDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Living Status',
        isEditMode: false,
        languageArr: this.lookupLst$['language'],
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter('');
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.livingStatus.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.addLivingStatusTypDialogRef = null;
    });
    this.addLivingStatusTypDialogRef = dialogRef;
  }

  deleteLivingStatusTypDialogRef: MatDialogRef<BiomatricTypeComponent>;
  deleteAddLivingStatusTypDialog(index): void {
    if (this.deleteLivingStatusTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(BiomatricTypeComponent, {
      width: this.DIALOG_SM,
      data: {
        index,
        routeName: location.pathname
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter("");
      this.deleteLivingStatusTypDialogRef = null;
    });
    this.deleteLivingStatusTypDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      livingStatus: result[key],
      key: key,
    }));

    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
