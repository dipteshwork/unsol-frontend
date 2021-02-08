import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { IdTypesDialogComponent } from '../../dialog/lookups/id-types-dialog/id-types-dialog.component';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-idtyps-lk',
  templateUrl: './idtyps-lk.component.html',
  styleUrls: ['./idtyps-lk.component.scss'],
})
export class IdtypsLkComponent implements OnInit {
  result: any;
  idTypArr: any;
  displayedColumns: string[] = ['position', 'idType', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  lkupRegimeForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  translations = {};
  public lookupLst$: LookupLst;
  public activities$: Observable<any>;
  primaryTh = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {

    this.loadLookup();
    this.getIdTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getIdTypes() {
    this.dataSource.data = this.lookupLst$['idType'].map(
      (item) => 
        item[this.appLang.toUpperCase()]
    );

    const primaryObj = this.lookupLst$['idType'].find((item, index) => item['EN']['idTypeName'] === 'PRIMARY');
    this.primaryTh = primaryObj[this.appLang.toUpperCase()]['idTypeName'];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(form: FormGroup) {
    this.adminService
    .addEntryTyp({ entryTypeName: form.value['idType'], isActive: true, prefix: 1, })
    .subscribe((data) => {
    });
  }

  rowClicked(row: any, i: number): void {
    this.openEditEntryTypsDialog(row, i);
  }


  loadLookup() {
    this.idTypArr = this.lookupCollprovider.lookupColl.idType;
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'idType').then(() => {
      this.loadLookup();
      this.getIdTypes();
      const output = this.idTypArr.map((val, index) => ({
        idTypeName: val && val[this.appLang.toUpperCase()].idTypeName,
        isActive: val && val[this.appLang.toUpperCase()].isActive,
      }));
      this.dataSource = new MatTableDataSource(output);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editIdTypsDialogRef: MatDialogRef<IdTypesDialogComponent>;
  openEditEntryTypsDialog(row: any, i: number): void {
    if (this.editIdTypsDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(IdTypesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Id Type',
        idType: row,
        idTypes: this.lookupLst$['idType'],
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
        this.dataSource.data = result.idType.map(
          (item) => item[this.appLang.toUpperCase()]
        );
        this.lookupLst$ = result;
      }
      this.editIdTypsDialogRef = null;
    });
    this.editIdTypsDialogRef = dialogRef;

  }

  editSancIdTypes(idTypesDialog: String): void {}

  newIdType() {
    this.openAddIdTypsDialog();
  }

  addIdTypsDialogRef: MatDialogRef<IdTypesDialogComponent>;
  openAddIdTypsDialog(): void {
    if (this.addIdTypsDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(IdTypesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Id Type',
        isEditMode: false,
        languageArr: this.lookupLst$['language'],
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
        this.dataSource.data = result.idType.map(
          (item) => item[this.appLang.toUpperCase()]
        );
        this.lookupLst$ = result;
      }
      this.editIdTypsDialogRef = null;
    });
    this.editIdTypsDialogRef = dialogRef;
  }

  deleteIdTypsDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteIdTypsDialog(index): void {
    if (this.deleteIdTypsDialogRef != null) {
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

    dialogRef.afterClosed().subscribe((result: String) => {
      this.applyFilter("");
      this.deleteIdTypsDialogRef = null;
    });
    this.deleteIdTypsDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      key: key,
      position: index + 1,
      idType: result[key],
    }));
    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
