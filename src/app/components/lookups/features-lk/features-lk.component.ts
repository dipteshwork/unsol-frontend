import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { FeaturesDialogComponent } from '../../dialog/lookups/features-dialog/features-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { LookupLst } from '../../../classes/lookupLst';
import { AdminService } from "../../../services/admin.service";
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-features-lk',
  templateUrl: './features-lk.component.html',
  styleUrls: ['./features-lk.component.scss'],
})
export class FeaturesLkComponent implements OnInit {
  public lookupLst$: LookupLst;
  public activities$: Observable<any>;
  result: any;
  featureArr: any;
  displayedColumns: string[] = ['position', 'features', 'status', 'edit', 'delete'];
  dataSource: any;
  lkupRegimeForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  translations = {};
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
    const keyArr = Object.keys(this.featureArr);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      features: this.featureArr[key],
      key: key,
    }));

    const output = this.featureArr.map((val, index) => ({
      position: index + 1,
      features: val,
    }));
    this.dataSource = new MatTableDataSource(dsResult);

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
    this.openEditFeatureDialog(row, i);
  }


  loadLookup() {
    this.featureArr = this.lookupCollprovider.lookupColl.features;
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'features').then(() => {
      this.loadLookup();
      const keyArr = Object.keys(this.featureArr);
      const dsResult = keyArr.map((key, index) => ({
        position: index + 1,
        features: this.featureArr[key],
        key: key,
      }));
      this.dataSource = new MatTableDataSource(dsResult);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editFeatureDialogRef: MatDialogRef<FeaturesDialogComponent>;
  openEditFeatureDialog(row: any, i: number): void {
    if (this.editFeatureDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Feature',
        row,
        lang: this.appLang.toUpperCase(),
        languageArr: this.lookupLst$['language'],
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter('')
      if (result) {
        this.addIdTypes(result);
      }
      this.editFeatureDialogRef = null;
    });
    this.editFeatureDialogRef = dialogRef;
  }

  newFeature() {
    this.openAddFeatureDialog();
  }

  addFeatureDialogRef: MatDialogRef<FeaturesDialogComponent>;
  openAddFeatureDialog(): void {
    if (this.addFeatureDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Feature',
        lang: this.appLang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((result: String) => {
      if (result) {
        this.addIdTypes(result);
      }
      this.addFeatureDialogRef = null;
    });
    this.addFeatureDialogRef = dialogRef;
  }

  deleteFeatureDialogRef: MatDialogRef<BiomatricTypeComponent>;
  openDeleteFeatureDialog(index): void {
    if (this.deleteFeatureDialogRef != null) {
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
      this.deleteFeatureDialogRef = null;
    });
    this.deleteFeatureDialogRef = dialogRef;
  }

  addIdTypes(result): void {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      features: result[key],
      key: key,
    }));

    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
