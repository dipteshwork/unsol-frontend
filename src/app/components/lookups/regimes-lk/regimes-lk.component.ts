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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { EditRegimeMeasuresDialogComponent } from '../../dialog/lookups/edit-regimes-dialog/edit-regimes-dialog.component';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { LookupLst } from '../../../classes/lookupLst';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";

@Component({
  selector: 'app-regimes-lk',
  templateUrl: './regimes-lk.component.html',
  styleUrls: ['./regimes-lk.component.scss'],
})
export class RegimesLkComponent implements OnInit, AfterViewInit {
  public lookupLst$: LookupLst;
  public activities$: Observable<any>;
  measuresArr = [];
  addtlMeasures: FormArray = new FormArray([]);
  result: any;
  displayedColumns = ['position', 'name', 'prefix', 'measures', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  lkupRegimeForm: FormGroup;
  DIALOG_MD: string = window.screen.width > 768 ? '60%' : '80%';
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  langArr: string[];
  translations = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private lookupSrv: AdminService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.loadLookup();
    this.lkupRegimeForm = this.fb.group({
      regimeNm: ['', [Validators.required]],
      regimePrefix: ['', [Validators.required, Validators.maxLength(2)]],
      resolutionNum: null,
      resolutionDte: null,
      applicableMeasures: this.fb.group({}),
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.measuresArr = this.lookupLst$['measures'].map(
      (item) => item[this.appLang.toUpperCase()].isActive
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createApplicableMeasures() {
    const tmp = this.lkupRegimeForm.get('applicableMeasures');
    return tmp;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'regime').then(() => {
      this.loadLookup();
    });
  }

  loadLookup() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
    this.langArr = this.lookupLst$.language.map(
      lang => lang.acronym
    );
    this.getRegimeValFrmArrOfObj(this.lookupLst$['regime']);
  }

  getMeasures() {
    return this.lkupRegimeForm.get('applicableMeasures');
  }

  getRegimeValFrmArrOfObj(regimes) {
    this.dataSource.data = regimes.map((item) => {
      const regime = item[this.appLang.toUpperCase()];
      const keys = Object.keys(regime);
      const prefix = keys.find(
        (key) => key !== 'measures' && key !== 'isActive'
      );
      const isActive = regime.isActive || false;
      const name = {};
      this.langArr.forEach(
        lang => Object.assign(name, { [lang]: item[lang][prefix] })
      );
      const measures = {};
      this.langArr.forEach(
        lang => Object.assign(measures, { [lang]: item[lang]['measures'] })
      );
      return { prefix, name, measures, isActive };
    });
  }

  onSubmit(form: FormGroup) {
    if (this.lkupRegimeForm.valid) {
      const regimeNm = this.lkupRegimeForm.value.regimeNm;
      const regimePrefix = this.lkupRegimeForm.value.regimePrefix;
      const applicMeas = this.lkupRegimeForm.value.applicableMeasures;
      const isActive = this.lkupRegimeForm.value.isActive;
      const applicableMeasArr = [];

      for (const key of Object.keys(applicMeas)) {
        if (applicMeas[key]) {
          applicableMeasArr.push(key);
        }
      }

      for (let i = 0; i < this.addtlMeasures.controls.length; i++) {
        const meas1 = this.addtlMeasures.controls[i]['controls'].moreMeasures
          .value;
        if (meas1.trim().length > 1) {
          applicableMeasArr.push(meas1.trim());
        }
      }

      this.lookupSrv
        .addRegime({
          prefix: regimePrefix,
          regimeName: regimeNm,
          measures: applicableMeasArr,
          isActive,
        })
        .subscribe((data) => {
          this.getRegimeValFrmArrOfObj(data.regime);
          this.cd.markForCheck();
          this.lkupRegimeForm.reset();
        });
    }
  }

  rowClicked(row: any): void {
    this.openEditMeasuresDialog(row);
  }

  editMeasuresDialogRef: MatDialogRef<EditRegimeMeasuresDialogComponent>;
  openEditMeasuresDialog(row: any): void {
    if (this.editMeasuresDialogRef) {
      return;
    }

    const dialogRef = this.dialog.open(EditRegimeMeasuresDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Regime',
        row,
        allMeasures: this.lookupLst$.measures,
        regimes: this.lookupLst$['regime'],
        lang: this.appLang,
        languageArr: this.lookupLst$['language'],
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter('')
      if (result) {
        this.getRegimeValFrmArrOfObj(result);
        this.lookupLst$['regime'] = result;
      }
      this.editMeasuresDialogRef = null;
    });
    this.editMeasuresDialogRef = dialogRef;
  }

  addRegimeDialogRef: MatDialogRef<EditRegimeMeasuresDialogComponent>;
  addRegimeDialog(): void {
    if (this.addRegimeDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(EditRegimeMeasuresDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Regime',
        allMeasures: this.lookupLst$.measures,
        regimes: this.lookupLst$['regime'],
        lang: this.appLang,
        languageArr: this.lookupLst$['language'],
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getRegimeValFrmArrOfObj(result);
        this.lookupLst$['regime'] = result;
      }
      this.addRegimeDialogRef = null;
    });
    this.addRegimeDialogRef = dialogRef;
  }

  deleteRegimeDialogRef: MatDialogRef<BiomatricTypeComponent>;
  deleteRegimeDialog(index): void {
    if (this.deleteRegimeDialogRef != null) {
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
      this.deleteRegimeDialogRef = null;
    });
    this.deleteRegimeDialogRef = dialogRef;
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
