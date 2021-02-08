import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { TranslationsDialogComponent } from '../../dialog/lookups/translations-dialog/translations-dialog.component';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from "../../../services/admin.service";
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";


@Component({
  selector: 'app-translations-lk',
  templateUrl: './translations-lk.component.html',
  styleUrls: ['./translations-lk.component.scss'],
})
export class TranslationsLkComponent implements OnInit {
  result: any;
  translationArr: any;
  languageArr: any;
  displayedColumns: string[] = ['position', 'en', 'ch', 'fr', 'ar', 'ru', 'sp', 'delete'];
  dataSource: any;
  lkupRegimeForm: FormGroup;
  DIALOG_MD: string = window.screen.width > 768 ? '30%' : '80%';
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  translations = {};

  editBiometricTypDialogRef: MatDialogRef<TranslationsDialogComponent>;
  addTranslationsTypDialogRef: MatDialogRef<TranslationsDialogComponent>;
  deleteTranslationsTypDialogRef: MatDialogRef<BiomatricTypeComponent>;
  editTranslationsTypDialogRef: MatDialogRef<TranslationsDialogComponent>;

  public lookupLst$: LookupLst;
  public activities$: Observable<any>;

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
    this.dataSource = new MatTableDataSource(this.translationArr);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(form: FormGroup) {
    if (this.lkupRegimeForm.valid) {
      const regimeNm = this.lkupRegimeForm.value.regimeNm;
      const regimePrefix = this.lkupRegimeForm.value.regimePrefix;
      const applicMeas = this.lkupRegimeForm.value.applicableMeasures;
    }
  }

  rowClicked(row: any, i: number): void {
    this.openEditTranslationsTypDialog(row, i);
  }

  loadLookup() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.translationArr = this.lookupCollprovider.lookupColl.translations.translation;
    this.languageArr = this.lookupCollprovider.lookupColl.language;
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'translations').then(() => {
      this.translationArr = this.lookupCollprovider.lookupColl.translations.translation;
      this.dataSource = new MatTableDataSource(this.translationArr);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editBiometricTypDialog(row: any, i: number): void {
    if (this.editBiometricTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(TranslationsDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit Translation',
        row,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter('')
      if (result) {
        let keyArr = Object.keys(result);
        let dsResult = keyArr.map((key) => ({
          prefix: key,
          name: result[key],
        }));

        this.dataSource.data = dsResult;
        this.cd.detectChanges();
      }
      this.editBiometricTypDialogRef = null;
    });
    this.editBiometricTypDialogRef = dialogRef;
  }

  newTranslationTyp() {
    this.openAddTranslationsTypDialog();
  }

  openAddTranslationsTypDialog(): void {
    if (this.addTranslationsTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(TranslationsDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Add Translation',
        languageArr: this.languageArr,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: String) => {
      if (result) {
        this.addIdTypes(result['translations']['translation']);
      }
      this.addTranslationsTypDialogRef = null;
    });
    this.addTranslationsTypDialogRef = dialogRef;
  }

  openEditTranslationsTypDialog(row: any, i: number): void {
    if (this.editTranslationsTypDialogRef) {
      return;
    }
    const dialogRef = this.dialog.open(TranslationsDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit Translation',
        languageArr: this.languageArr,
        row,
        i,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: String) => {
      if (result) {
        this.addIdTypes(result['translations']['translation']);
      }
      this.editTranslationsTypDialogRef = null;
    });
    this.editTranslationsTypDialogRef = dialogRef;
  }

  openDeleteTranslationsTypDialog(keyword: string): void {
    if (this.deleteTranslationsTypDialogRef) {
      return;
    }
    console.log('index:', keyword)
    const dialogRef = this.dialog.open(BiomatricTypeComponent, {
      width: this.DIALOG_MD,
      data: {
        index: keyword,
        routeName: location.pathname
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: String) => {
      this.applyFilter('');
      this.deleteTranslationsTypDialogRef = null;
    });
    this.deleteTranslationsTypDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    const keyArr = Object.keys(result);
    this.dataSource.data = result;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
