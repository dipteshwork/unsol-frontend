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
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { CategoriesDialogComponent } from '../../dialog/lookups/categories-dialog/categories-dialog.component';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from "../../../services/admin.service";
import { BiomatricTypeComponent } from "../../dialog/entry/delete-general-component/delete-general.component";


@Component({
  selector: 'app-categories-lk',
  templateUrl: './categories-lk.component.html',
  styleUrls: ['./categories-lk.component.scss'],
})
export class CategoriesLkComponent implements OnInit {
  appLang = 'en';
  translations = {};
  result: any;
  routeName: any;
  categoryArr: any;
  displayedColumns: string[] = ['position', 'catTypes', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  lkupRegimeForm: FormGroup;
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  highTh = '';

  @Input('lkupSrv') lookupLst$: LookupLst;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public activities$: Observable<any>;

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
    this.getIdCategoryTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getIdCategoryTypes() {
    this.dataSource.data = this.lookupLst$['idCategory'].map(
      (item) => 
        item[this.appLang.toUpperCase()]
    );

    const highObj = this.lookupLst$['idCategory'].find((item, index) => item['EN']['idCategoryName'] === 'High');
    this.highTh = highObj[this.appLang.toUpperCase()]['idCategoryName'];
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
    .addEntryTyp({ entryTypeName: form.value['idCategory'], isActive: true, prefix: 1, })
    .subscribe((data) => {
    });
  }

  rowClicked(row: any, i: number): void {
    this.openEditCategoryDialog(row, i);
  }

  loadLookup() {
    this.categoryArr = this.lookupCollprovider.lookupColl.idCategory;
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupCollprovider.load('ALL', filterValue, 'idCategory').then(() => {
      this.loadLookup();
      this.getIdCategoryTypes();
      const output = this.categoryArr.map((val, index) => ({
        idCategoryName: val && val[this.appLang.toUpperCase()].idCategoryName,
        isActive: val && val[this.appLang.toUpperCase()].isActive,
      }));
      this.dataSource = new MatTableDataSource(output);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  editCategoriesDialogRef: MatDialogRef<CategoriesDialogComponent>;
  openEditCategoryDialog(row: any, i: number): void {
    if (this.editCategoriesDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit Category',
        idCategory: row,
        idCategories: this.lookupLst$['idCategory'],
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
        this.dataSource.data = result.idCategory.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.editCategoriesDialogRef = null;
    });
    this.editCategoriesDialogRef = dialogRef;
  }

  newCategory() {
    this.openAddFeatureDialog();
  }

  addCategoryDialogRef: MatDialogRef<CategoriesDialogComponent>;
  openAddFeatureDialog(): void {
    if (this.addCategoryDialogRef != null) {
      return;
    }
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add Category',
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
        this.dataSource.data = result.idCategory.map(
          (item) => item[this.appLang.toUpperCase()] || ''
        );
        this.lookupLst$ = result;
      }
      this.addCategoryDialogRef = null;
    });
    this.addCategoryDialogRef = dialogRef;
  }

  
  deleteCategoryDialogRef: MatDialogRef<BiomatricTypeComponent>;
  deleteFeatureDialog(index, routeName): void {
    if (this.deleteCategoryDialogRef != null) {
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
      this.deleteCategoryDialogRef = null;
    });
    this.deleteCategoryDialogRef = dialogRef;
  }

  addIdTypes(result) {
    const keyArr = Object.keys(result);
    const dsResult = keyArr.map((key, index) => ({
      position: index + 1,
      catTypes: result[key],
      key: key,
    }));
    this.dataSource.data = dsResult;
    this.cd.detectChanges();
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
