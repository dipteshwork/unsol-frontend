import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupLst } from '../../../classes/lookupLst';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { BiometricTypeDialogComponent } from '../../dialog/lookups/biometric-type-dialog/biometric-type-dialog.component';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-biometric-lk',
  templateUrl: './biometric-lk.component.html',
  styleUrls: ['./biometric-lk.component.scss'],
})
export class BiometricLkComponent implements OnInit {
  appLang = 'en';
  translations = {};
  routeName: any;
  result: any;
  biometricArr: any;
  displayedColumns: string[] = ['position', 'biometricType', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  lkupRegimeForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  public activities$: Observable<any>;

  @Input('lkupSrv') lookupLst$: LookupLst;
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

    this.initilizeRoute();
    this.loadLookup();
    this.getBiometricTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getBiometricTypes() {
    this.dataSource.data = this.lookupLst$['biometricType'].map(
      (item) => 
        item[this.appLang.toUpperCase()]
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  initilizeRoute(){
    this.routeName = location.pathname
  }

  onSubmit(form: FormGroup) {
    this.adminService
    .addEntryTyp({ entryTypeName: form.value['biometricType'], isActive: true, prefix: 1, })
    .subscribe((data) => {
    });
  }

  rowClicked(row: any, i: number): void {
    this.editBiometricTypDialog(row, i);
  }

  loadLookup() {
    this.biometricArr = this.lookupCollprovider.lookupColl.biometricType;

    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'biometricType').then(() => {
      this.loadLookup();
      this.getBiometricTypes();
      const output = this.biometricArr.map((val, index) => {
        return({
        biometricTypeName: val && val[this.appLang.toUpperCase()].biometricTypeName,
        isActive: val && val[this.appLang.toUpperCase()].isActive,
      })});
      this.dataSource = new MatTableDataSource(output);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editBiometricTypDialogRef: MatDialogRef<BiometricTypeDialogComponent>;
  editBiometricTypDialog(row: any, i: number): void {
    if (this.editBiometricTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(BiometricTypeDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Biometric Type',
        biometricType: row,
        biometricTypes: this.lookupLst$['biometricType'],
        isEditMode: true,
        lang: this.appLang.toUpperCase(),
        languageArr: this.lookupLst$['language'],
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.applyFilter('');
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.biometricType.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.editBiometricTypDialogRef = null;
    }); 
    this.editBiometricTypDialogRef = dialogRef;
  }

  newBiometricTyp() {
    this.openAddBiometricTypDialog();
  }

  addBiometricTypDialogRef: MatDialogRef<BiometricTypeDialogComponent>;
  openAddBiometricTypDialog(): void {
    if (this.addBiometricTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(BiometricTypeDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Biometric Type',
        lang: this.appLang,
        isEditMode: false,
        languageArr: this.lookupLst$['language'],
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.biometricType.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.addBiometricTypDialogRef = null;
    });
    this.addBiometricTypDialogRef = dialogRef;
  }

  
  deleteBiometricTypDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteBiometricTypDialog(index, routeName): void {
    if (this.deleteBiometricTypDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(BiomatricTypeComponent, {
      width: this.DIALOG_SM,
      data: {
        index,
        routeName: this.routeName
      },
      hasBackdrop: true,
    });
    // model for measures to be imported
    dialogRef.afterClosed().subscribe((result: String) => {
      this.applyFilter("");
      this.deleteBiometricTypDialogRef = null;
    });
    this.deleteBiometricTypDialogRef = dialogRef;
  }

  addIdTypes(result) {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      biometricType: result[key],
      key: key,
    }));
    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
