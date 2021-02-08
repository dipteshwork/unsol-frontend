import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AdminService }  from '../../../services/admin.service';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { EditCountriesDialogComponent } from '../../dialog/lookups/edit-countries-dialog/edit-countries-dialog.component';
import { Countries } from '../../../models/countriesModel';
import { LookupCollproviderProvider } from 'src/app/services/providers/lookup-collprovider.service';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";


@Component({
  selector: 'app-countries-lk',
  templateUrl: './countries-lk.component.html',
  styleUrls: ['./countries-lk.component.scss'],
})
export class CountriesLkComponent implements OnInit, OnChanges {
  appLang = 'en';
  translations = {};
  countriesArr = [];
  result: any;
  displayedColumns = [
    'position',
    'UN_name',
    'en_Short',
    'ar_Short',
    'ch_Short',
    'fr_Short',
    'sp_Short',
    'ru_Short',
    'status',
    'edit',
    'delete'
  ];
  dataSource = new MatTableDataSource();
  lkupCountriesForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  public lookupLst$: LookupLst;
  public activities$: Observable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private lookupSrv1: LookupCollproviderProvider,
    private authServ: AuthService,
    private adminService: AdminService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.result) {
      this.dataSource.data = [...this.result];
      this.cd.detectChanges();
    }
  }

  async ngOnInit() {
    this.loadLookup();
    this.lkupCountriesForm = this.fb.group({});
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadLookup() {
    this.lookupLst$ = this.lookupSrv1.getLookupColl();
    this.getValFrmArrOfObjs();
    this.countriesArr = this.lookupLst$['un_country_list.record'];
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupSrv1.getTranslations();
  }

  getValFrmArrOfObjs() {
    const keyArr = this.lookupLst$['un_country_list'];
    this.result = keyArr['record'].map((elemData) => {
      return elemData;
    });
    this.dataSource.data = this.result;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupSrv1.load('ALL', filterValue, 'un_country_list').then(() => {
      this.loadLookup();
    });
  }

  rowClicked(rowData: any) {
    this.openEditCountriesDialog(rowData);
  }

  editCountriesDialogRef: MatDialogRef<EditCountriesDialogComponent>;
  openEditCountriesDialog(row: Countries): void {
    if (this.editCountriesDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(EditCountriesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Countries',
        row,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: Countries) => {
      this.applyFilter('')
      if (result) {
        this.result = result;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = this.result;

        this.cd.detectChanges();
      }
      this.editCountriesDialogRef = null;
    });

    this.editCountriesDialogRef = dialogRef;
  }
  deleteCountriesDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteCountriesDialog(index): void {
    if (this.deleteCountriesDialogRef != null) {
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

    dialogRef.afterClosed().subscribe((result: Countries) => {
      this.applyFilter("");
      this.deleteCountriesDialogRef = null;
    });

    this.deleteCountriesDialogRef = dialogRef;
  }
  editCountries(measuresDialog: Countries): void {}

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
