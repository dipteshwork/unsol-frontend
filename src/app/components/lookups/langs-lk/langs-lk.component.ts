import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { LanguagesDialogComponent } from '../../dialog/lookups/languages-dialog/languages-dialog.component';
import { Language } from '../../../models/languageModel';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";


@Component({
  selector: 'app-langs-lk',
  templateUrl: './langs-lk.component.html',
  styleUrls: ['./langs-lk.component.scss'],
})
export class LangsLkComponent implements OnInit {
  result: any;
  langArr: any;
  workingLang: Language;
  displayedColumns: string[] = ['position', 'langs', 'working', 'official', 'status', 'edit', "delete"];
  dataSource: any;
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
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadLookup();
    const langTyp = new Array();

    this.langArr.forEach((item, index) => {
      langTyp.push(item);
    });
    const output = langTyp;
    this.dataSource = new MatTableDataSource(output);

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
    this.openEditLanguageDialog(row, i);
  }

  loadLookup() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupCollprovider.lookupColl.language;
    const lang = this.langArr.find((item) => item.isWorking);
    this.workingLang = lang ? lang : null;
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'language').then(() => {
      this.loadLookup();
      const langTyp = new Array();

      this.langArr.forEach((item, index) => {
        langTyp.push(item);
      });
      const output = langTyp;
      this.dataSource = new MatTableDataSource(output);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editLanguageDialogRef: MatDialogRef<LanguagesDialogComponent>;
  openEditLanguageDialog(row: any, i: number): void {
    if (this.editLanguageDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(LanguagesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Language',
        row,
        workingLang: this.workingLang,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter('')
      if (result) {
        this.dataSource.data = this.dataSource.data.map((item) =>
          item.name === result.oldRowData.name
            ? result.modifiedRowData
            : { ...item, isWorking: false }
        );
      }
      this.editLanguageDialogRef = null;
    });
    this.editLanguageDialogRef = dialogRef;
  }

  newLanguage() {
    this.openAddLanguageDialog();
  }

  addLanguageDialogRef: MatDialogRef<LanguagesDialogComponent>;
  openAddLanguageDialog(): void {
    if (this.addLanguageDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(LanguagesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Language',
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: String) => {
      if (result) {
        this.addIdTypes(result);
      }
      this.addLanguageDialogRef = null;
    });
    this.addLanguageDialogRef = dialogRef;
  }

  deleteLanguageDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteLanguageDialog(index): void {
    if (this.deleteLanguageDialogRef != null) {
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
      this.deleteLanguageDialogRef = null;
    });
    this.deleteLanguageDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    this.dataSource.data = [...this.dataSource.data, result];
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
