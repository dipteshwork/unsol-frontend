import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {
  MatSort,
  MatDialogRef,
  MatDialog,
  MatPaginator,
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { EditMeasuresDialogComponent } from '../../dialog/lookups/edit-measures-dialog/edit-measures-dialog.component';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { LookupLst } from '../../../classes/lookupLst';
import { LookupCollproviderProvider } from 'src/app/services/providers/lookup-collprovider.service';
import { LkMeasuresValidationService } from '../../../services/lk-measures-validation.service';
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";


@Component({
  selector: 'app-measures-lk',
  templateUrl: './measures-lk.component.html',
  styleUrls: ['./measures-lk.component.scss'],
})
export class MeasuresLkComponent implements OnInit, AfterViewInit {
  public lookupLst$: LookupLst;
  displayedColumns = ['position', 'measureName', 'measureStatus', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  lkupMeasureForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  appLang = 'en';
  translations = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private lookupSrv: AdminService,
    private dialog: MatDialog,
    private lookupSrv1: LookupCollproviderProvider,
    private measuresValidationSrv: LkMeasuresValidationService,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.lkupMeasureForm = this.fb.group({
      measures: [
        '',
        [Validators.required],
        this.uniqueMeasuresValidation.bind(this),
      ],
    });
    this.loadLookup();
    this.getMeasures();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupSrv1.load("ALL", filterValue, 'measures').then(() => {
      this.loadLookup();
      this.getMeasures();
    });
  }

  loadLookup() {
    this.lookupLst$ = this.lookupSrv1.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupSrv1.getTranslations();
  }

  getMeasures() {
    this.dataSource.data = this.lookupLst$['measures'].map(
      (item) => item[this.appLang.toUpperCase()]
    );
  }

  onSubmit(form: FormGroup) {
    // now call the backend to update the database for measures
    this.lookupSrv
      .addMeasure({ measureNm: form.value['measures'], isActive: true })
      .subscribe((data) => {
      });
  }

  rowClicked(row: any): void {
    this.openEditMeasuresDialog(row);
  }

  editMeasureDialogRef: MatDialogRef<EditMeasuresDialogComponent>;
  openEditMeasuresDialog(rowData: {}): void {
    if (this.editMeasureDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(EditMeasuresDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Measure',
        measure: rowData,
        measures: this.lookupLst$['measures'],
        languageArr: this.lookupLst$['language'],
        isEditMode: true,
        lang: this.appLang.toUpperCase(),
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.applyFilter('')
      if (result) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._changePageSize(this.paginator.pageSize);
        this.dataSource.data = result.measures.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.editMeasureDialogRef = null;
    });
    this.editMeasureDialogRef = dialogRef;
  }

  addMeasuresDialogRef: MatDialogRef<EditMeasuresDialogComponent>;
  addMeasuresDialog(): void {
    if (this.addMeasuresDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(EditMeasuresDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Measure',
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
        this.dataSource.data = result.measures.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.addMeasuresDialogRef = null;
    });
    this.addMeasuresDialogRef = dialogRef;
  }

  deleteMeasuresDialogRef: MatDialogRef<BiomatricTypeComponent>;
  deleteMeasuresDialog(index): void {
    if (this.deleteMeasuresDialogRef != null) {
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
    dialogRef.afterClosed().subscribe((result: any) => {
      this.applyFilter("");
      this.deleteMeasuresDialogRef = null;
    });
    this.deleteMeasuresDialogRef = dialogRef;
  }

  uniqueMeasuresValidation(control: AbstractControl) {
    return this.measuresValidationSrv
      .checkMeasureNotTaken(control.value)
      .map((res) => {
        return res ? null : { measureTaken: true };
      });
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
