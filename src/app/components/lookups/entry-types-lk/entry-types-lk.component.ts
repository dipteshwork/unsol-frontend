import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef,
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../classes/lookupLst';
import { SancEntryTypesDialogComponent } from '../../dialog/lookups/sanc-entry-types-dialog/sanc-entry-types-dialog.component';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-entry-types-lk',
  templateUrl: './entry-types-lk.component.html',
  styleUrls: ['./entry-types-lk.component.scss'],
})
export class EntryTypesLkComponent implements OnInit, AfterViewInit {
  public lookupLst: LookupLst;
  entryTyp: EntryTyp;
  result: any;
  displayedColumns = [
    'position',
    'name',
    'prefix',
    'entryTypeStatus',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource();
  lkupEntryTypForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  langArr: string[];
  translations = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private lookupSrv: LookupCollproviderProvider,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private adminService: AdminService,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    // this.lkupEntryTypForm = this.fb.group({
    //   entryTypNm: ['', [Validators.required]],
    //   entryPrefix: ['', [Validators.required, Validators.maxLength(1)]],
    // });
    this.lkupEntryTypForm = this.fb.group({
      entryType: [
        '',
        [Validators.required],
        // this.uniqueMeasuresValidation.bind(this),
      ],
    });

    this.loadLookup();
    this.getEntryTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupSrv
      .load('ALL', filterValue, 'entryType')
      .then(() => {
        this.loadLookup();
        this.getEntryTypes();
      });
  }

  newSanctionEntryType() {
    this.openAddEntryTypsDialog();
  }

  newDeleteEntryType(index) {
    this.openDeleteEntryTypsDialog(index);
  }

  loadLookup() {
    this.lookupLst = this.lookupSrv.lookupColl;
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupSrv.getTranslations();
    this.langArr = this.lookupLst.language.map((lang) => lang.acronym);
  }

  getEntryTypes() {
    this.dataSource.data = this.lookupLst['entryType'].map(
      (item) => item[this.appLang.toUpperCase()]
    );
  }

  getEntryTypeArrOfObjs() {
    const keyArr = Object.keys(this.lookupLst['entryType']);
    const appLang = this.appLang.toUpperCase();
    this.result = keyArr.map((key) => {
      const record = {};
      this.langArr.forEach((lang) =>
        Object.assign(record, {
          [`${lang.toLowerCase()}_name`]: this.lookupLst['entryType'][key][
            lang
          ],
        })
      );
      return {
        prefix: key,
        name: this.lookupLst['entryType'][key][appLang],
        ...record,
      };
    });
    this.dataSource.data = this.result;
  }

  onSubmit(form: FormGroup) {
    // now call the backend to update the database for measures
    this.adminService
      .addEntryTyp({
        entryTypeName: form.value['entryTypes'],
        isActive: true,
        prefix: 1,
      })
      .subscribe((data) => {});
  }

  // onSubmit(form: FormGroup) {
  //   // now call the backend to update the database
  //   const newEntryType = {};
  //   this.langArr.forEach(
  //     lang => Object.assign(newEntryType, { [`${lang.toLowerCase()}EntryTyp`]: form.value[`${lang.toLowerCase()}EntryTypNm`] })
  //   );
  //   this.adminService
  //     .addEntryTyp({
  //       entryPrefix: form.value['entryPrefix'],
  //       ...newEntryType
  //     })
  //     .subscribe((data) => {
  //       this.dataSource.data = this.result;
  //     });
  // }

  rowClicked(row: any, i: number): void {
    this.openEditEntryTypsDialog(row, i);
  }

  editEntryTypsDialogRef: MatDialogRef<SancEntryTypesDialogComponent>;
  openEditEntryTypsDialog(row: any, i: number): void {
    if (this.editEntryTypsDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(SancEntryTypesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Sanction Entry types',
        entryType: row,
        entryTypes: this.lookupLst['entryType'],
        languageArr: this.lookupLst['language'],
        isEditMode: true,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });
    // model for measures to be imported
    dialogRef.afterClosed().subscribe((result) => {
      this.applyFilter('')
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.entryType.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst = result;
        this.cd.detectChanges();
      }
      this.editEntryTypsDialogRef = null;
    });
    this.editEntryTypsDialogRef = dialogRef;

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     this.addSancEntryTypes(result);
    //   }
    //   this.editEntryTypsDialogRef = null;
    // });
    // this.editEntryTypsDialogRef = dialogRef;
  }

  addEntryTypsDialogRef: MatDialogRef<SancEntryTypesDialogComponent>;
  openAddEntryTypsDialog(): void {
    if (this.addEntryTypsDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(SancEntryTypesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Sanction Entry types',
        isEditMode: false,
        languageArr: this.lookupLst['language'],
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });
    // model for measures to be imported
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.entryType.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst = result;
        this.cd.detectChanges();
      }
      this.addEntryTypsDialogRef = null;
    });
    this.addEntryTypsDialogRef = dialogRef;

    // dialogRef.afterClosed().subscribe((result: String) => {
    //   if (result) {
    //     this.addSancEntryTypes(result);
    //   }
    //   this.addEntryTypsDialogRef = null;
    // });
    // this.addEntryTypsDialogRef = dialogRef;
  }

  deleteEntryTypsDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteEntryTypsDialog(index): void {
    if (this.deleteEntryTypsDialogRef != null) {
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
    // model for measures to be imported

    dialogRef.afterClosed().subscribe((result: String) => {
      this.applyFilter("");
      this.deleteEntryTypsDialogRef = null;
    });
    this.deleteEntryTypsDialogRef = dialogRef;
  }

  addSancEntryTypes(result): void {
    const keyArr = Object.keys(result);
    const lang = this.appLang.toUpperCase();
    const dsResult = keyArr.map((key) => ({
      prefix: key,
      name: result[key][lang],
      en_name: result[key]['EN'],
      fr_name: result[key]['FR'],
      ch_name: result[key]['CH'],
      ru_name: result[key]['RU'],
      sp_name: result[key]['SP'],
      ar_name: result[key]['AR'],
    }));
    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}

export interface EntryTyp {
  entryPrefix: string;
  entryTyp: string;
}
