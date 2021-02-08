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
import { AdminService } from '../../../services/admin.service';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { GenderDialogComponent } from '../../dialog/lookups/gender-dialog/gender-dialog.component';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-gender-lk',
  templateUrl: './gender-lk.component.html',
  styleUrls: ['./gender-lk.component.scss'],
})
export class GenderLkComponent implements OnInit, AfterViewInit {
  result: any;
  genderArr: any;
  displayedColumns: string[] = ['position', 'gender', 'genderStatus', 'delete'];
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
    this.getGenders();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getGenders() {
    this.dataSource.data = this.lookupLst$['gender'].map(
      (item) => 
        item[this.appLang.toUpperCase()]
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(form: FormGroup) {
    this.adminService
    .addEntryTyp({ entryTypeName: form.value['gender'], isActive: true, prefix: 1, })
    .subscribe((data) => {
    });
  }

  rowClicked(row: any, i): void {
    this.editGenderTypDialog(row, i);
  }


  loadLookup() {
    this.genderArr = this.lookupCollprovider.lookupColl.gender;
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'gender').then(() => {
      this.loadLookup();
      this.getGenders();
      const output = this.genderArr.map((val, index) => ({
        genderName: val && val[this.appLang.toUpperCase()].genderName,
        isActive: val && val[this.appLang.toUpperCase()].isActive,
      }));
      this.dataSource = new MatTableDataSource(output);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editGenderTypDialogRef: MatDialogRef<GenderDialogComponent>;
  editGenderTypDialog(row: any, i: number): void {
    if (this.editGenderTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(GenderDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Gender',
        gender: row,
        genders: this.lookupLst$['gender'],
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
        this.dataSource.data = result.gender.map(
          (item) => item[this.appLang.toUpperCase()]
        );
        this.lookupLst$ = result;
      }
      this.editGenderTypDialogRef = null;
    });
    this.editGenderTypDialogRef = dialogRef;
  }

  newGenderTyp() {
    this.openAddGenderTypDialog();
  }

  addGenderTypDialogRef: MatDialogRef<GenderDialogComponent>;
  openAddGenderTypDialog(): void {
    if (this.addGenderTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(GenderDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Gender',
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
        this.dataSource.data = result.gender.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.addGenderTypDialogRef = null;
    });
    this.addGenderTypDialogRef = dialogRef;
  }

  deleteGenderTypDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteGenderTypDialog(index): void {
    if (this.deleteGenderTypDialogRef != null) {
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
      this.deleteGenderTypDialogRef = null;
    });
    this.deleteGenderTypDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      gender: result[key],
      key: key,
    }));

    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
