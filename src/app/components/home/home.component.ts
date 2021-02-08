import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnChanges, OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatSort, MatPaginator } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

import { SanctionLoadService } from '../../services/sanction-load.service';
import { NewEntryDialogComponent } from '../dialog/action/new-entry-dialog/new-entry-dialog.component';
import { AddSanctionMessageService } from '../../services/sidebar-events/add-sanction.service';
import { LookupCollproviderProvider } from '../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../classes/lookupLst';
import { XmlJsonReportsComponent } from '../dialog/report/xml-json-reports/xml-json-reports.component';
import { AuthService } from '../../services/auth.service';
import { Regime } from '../../models/regimesModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  public activities$: Observable<any>;
  moment = _rollupMoment || _moment;
  addNewEntryDialogRef: MatDialogRef<NewEntryDialogComponent>;
  addXmlJsonRptDialogRef: MatDialogRef<XmlJsonReportsComponent>;

  subscription: Subscription;
  displayedColumns = [
    'isPendingAmendment',
    'refNum',
    'recordType',
    'name',
    'sanctionType',
    'status',
    'modifiedDate',
  ];
  dataSource = new MatTableDataSource();
  sanctionWrkFlwState = '';
  preventSingleClick = false;
  timer: any;
  delay: Number;
  userRole: string;
  homeForm: FormGroup;
  translations = {};
  lang = 'EN';
  lookupLst$: LookupLst;
  selectedRowArray = [];
  selectedRowIndexArr = [];
  DIALOG_MD: string = window.screen.width > 768 ? '60%' : '80%';
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sancLoadSrv: SanctionLoadService,
    private router: Router,
    private dialog: MatDialog,
    private lookupCollprovider: LookupCollproviderProvider,
    private _addSanctionMesServ: AddSanctionMessageService,
    private fb: FormBuilder,
    private authServ: AuthService
  ) {
    this.subscription = this._addSanctionMesServ
      .listen()
      .subscribe((m: any) => {
        this.onFilterClick(m);
      });
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    if (this.userRole === 'Administrator') {
      setTimeout(() => this.router.navigateByUrl('/lookups'), 0);
    } else if (this.userRole !== 'Administrator' && this.userRole !== 'Superuser' && this.router.url === '/') {
      setTimeout(() => this.router.navigateByUrl('/all-entries'), 0);
    }

    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.lang = this.authServ.getPreferLang().toUpperCase();
    this.translations = this.lookupCollprovider.getTranslations();

    this.homeForm = this.fb.group({
      chosenLang: [this.lang, Validators.required],
    });

    const urlPath = this.router.url;
    let lookupEntryStatus = 'ACTIVE';

    if (urlPath === '/new-entries') {
      lookupEntryStatus = 'NEW';
    } else if (urlPath === '/pending-entries') {
      lookupEntryStatus = 'PENDING';
    } else if (urlPath === '/onhold-entries') {
      lookupEntryStatus = 'ONHOLD';
    } else if (urlPath === '/ext-entries') {
      lookupEntryStatus = 'ONHOLDEXTENDED';
    } else if (urlPath === '/amended-entries') {
      lookupEntryStatus = 'AMEND';
    } else if (urlPath === '/removed-entries') {
      lookupEntryStatus = 'REMOVED';
    } else if (urlPath === '/submitted-entries') {
      lookupEntryStatus = 'SUBMIT4REVIEW';
    } else if (urlPath === '/delisted-entries') {
      lookupEntryStatus = 'DELISTED';
    } else if (urlPath === '/all-entries') {
      lookupEntryStatus = 'ALL';
    }

    this.loadSanctions(this.lang, lookupEntryStatus);

    this.sanctionWrkFlwState = lookupEntryStatus;
    if (
      this.sanctionWrkFlwState === 'NEW' ||
      this.sanctionWrkFlwState === 'PENDING' ||
      this.sanctionWrkFlwState === 'INIT' ||
      this.sanctionWrkFlwState === 'ONHOLDEXTENDED' ||
      this.sanctionWrkFlwState === 'ONHOLD' ||
      this.sanctionWrkFlwState === 'SUBMIT4REVIEW'
    ) {
      this.displayedColumns = [
        'idNum',
        'recordType',
        'name',
        'sanctionType',
        'status',
        'modifiedDate',
      ];
    } else if (
      this.sanctionWrkFlwState === 'REMOVED' ||
      this.sanctionWrkFlwState === 'DELISTED'
    ) {
      this.displayedColumns = [
        'recordType',
        'name',
        'sanctionType',
        'status',
        'modifiedDate',
      ];
    } else if (this.sanctionWrkFlwState === 'ALL') {
      this.displayedColumns = [
        'idNum',
        // 'amendId',
        // 'refNum',
        'recordType',
        'name',
        'sanctionType',
        'status',
        'modifiedDate',
      ];
    } else if (this.sanctionWrkFlwState === 'AMEND') {
      this.displayedColumns = [
        'isPendingAmendment',
        'recordType',
        'amendId',
        'name',
        'sanctionType',
        'status',
        'modifiedDate',
      ];
    }

    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSanctions(langId: string, entryStatus: string) {
    this.sancLoadSrv.loadSanction(langId, entryStatus).subscribe((data) => {
      if (entryStatus === 'PENDING') {
        data = data.sort((a, b) => (b['idNum'] - a['idNum']));
      } else if (entryStatus === 'ALL' && this.userRole !== 'Superuser') {
        data = data.filter(item => item.status !== 'REMOVED');
      }
      this.dataSource.data = data;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.sancLoadSrv.loadSanction(this.lang, this.sanctionWrkFlwState, filterValue).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  isPersonSelected(i: any) {
    // tslint:disable-next-line:radix
    return this.selectedRowIndexArr.includes(parseInt(i));
  }

  toggleItemInArr(arr, item, selectedRowIndexArr, rowIndex) {
    const index = arr.indexOf(item);
    index === -1 ? arr.push(item) : arr.splice(index, 1);
    index === -1
      ? selectedRowIndexArr.push(rowIndex)
      : selectedRowIndexArr.splice(rowIndex, 1);
  }

  rowSingleClick(event, row, i) {
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        this.toggleItemInArr(
          this.selectedRowArray,
          row,
          this.selectedRowIndexArr,
          i
        );
      }
    }, delay);
  }

  rowDblClicked(event, row) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    this.rowClicked(row);
  }

  rowClicked(row: any): void {
    const refNum = row['refNum'];
    const idNum = row['idNum'];
    const amendmentId = row['amendmentId'];
    const entryStatus = this.lookupCollprovider.getEntryStatus(
      this.lang,
      row['status']
    );
    const queryStatus = entryStatus['EN'];

    this.router.navigateByUrl(
      !refNum ?
        `/user/${idNum}/${queryStatus}?lang=EN` :
        amendmentId ?
          `/user/${idNum}/${refNum}/${queryStatus}/${amendmentId}?lang=EN` :
          `/user/${idNum}/${refNum}/${queryStatus}?lang=EN`
    );
  }

  onFilterClick(event) {
    this.newSanction();
  }

  newSanction() {
    this.openNewEntryDialog();
  }

  ngOnChanges(changes: any) {}

  downloadJSONs(lang: string) {
    if (this.selectedRowArray && this.selectedRowArray.length > 0) {
      const idNumArr = [];
      // walk through the array and retrieve the idnumbers
      for (let len = 0; len < this.selectedRowArray.length; len++) {
        idNumArr.push(this.selectedRowArray[len].idNum);
      }
      let fileNm = idNumArr[0] + '.json';
      if (idNumArr.length > 0) {
        fileNm = idNumArr.join('_') + '.json';
      }

      // if idNumArr is empty, we want consolidateXML, or consolidated JSON
      this.sancLoadSrv.getJSONs(idNumArr).subscribe((data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileNm;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
      // now clear the arrays to remove highlighting
      this.selectedRowIndexArr.length = 0;
      this.selectedRowArray.length = 0;
    }
  }

  downloadConslXML(lang: string) {
    const status = 3; // aw need to choose this from front -- 3 implies a status of ACTIVE
    const idNumArr = [];
    const reportType = 2;
    // walk through the array and retrieve the idnumbers
    for (let len = 0; len < this.selectedRowArray.length; len++) {
      idNumArr.push(this.selectedRowArray[len].idNum);
    }
    let fileName = 'ConsolidatedRpt.xml';
    if (idNumArr.length > 0) {
      fileName = 'SanctionEntryRpt_' + idNumArr.join('_') + '.xml';
    }

    // if idNumArr is empty, we want consolidateXML, else requesting for individual Xmls
    this.sancLoadSrv
      .getConsolidatedXML(idNumArr, status, lang, reportType)
      .subscribe((data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        // now clear the arrays to remove highlighting
        this.selectedRowIndexArr.length = 0;
        this.selectedRowArray.length = 0;
      });
  }

  openNewEntryDialog(): void {
    const entryTypes = this.lookupLst$.entryType.map((item) => item[this.lang]['entryTypeName']);
    const dialogRef = this.dialog.open(NewEntryDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add new entry',
        entryType: this.getActiveEntryTypes(),
        language: this.lookupLst$.language,
        regime: this.getActiveRegimes(),
        translations: this.translations[this.lang.toLowerCase()],
        currentLanguage: this.lang,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // get selected index
        const index = entryTypes.findIndex((item) => item === result.entryType);

        // get English version of entry type
        const entryTypeName = this.lookupLst$.entryType.map((item) => item['EN'])[
          index
        ]['entryTypeName'];

        // get English version of regime here
        const regime = result.regime.split('--')[1];
        let regimeKey = '';
        const regimeObj = this.lookupLst$.regime.find((item) => {
          const key = Object.keys(item[this.lang]).find(
            (s) => item[this.lang][s] === regime
          );
          regimeKey = key || regimeKey;
          return key !== undefined;
        });

        this.router.navigate([
          '/new',
          {
            entryTypeName,
            language: result.language,
            regime: `${result.regime.split('--')[0]}--${
              regimeObj[result.language][regimeKey]
            }`,
          },
        ]);
      }
    });
    this.addNewEntryDialogRef = dialogRef;
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()][str] || str;
  }

  getActiveRegimes(): Regime[] {
    return this.lookupLst$.regime.filter(
      (item: Regime) => item[this.lang]['isActive'] === true
    ) as Regime[];
  }

  getActiveEntryTypes() {
    return this.lookupLst$.entryType.filter(item => item[this.lang].isActive).map((item) => item[this.lang]['entryTypeName']);
  }

  openXmlJsonRptDialog(): void {
    const lookupLst$ = this.lookupCollprovider.getLookupColl();
    const idNumArr = [];
    if (this.selectedRowArray && this.selectedRowArray.length > 0) {
      // walk through the array and retrieve the idnumbers
      for (let len = 0; len < this.selectedRowArray.length; len++) {
        idNumArr.push(this.selectedRowArray[len].idNum);
      }
    }
    const languageArr = lookupLst$.language.map((item) => item.acronym);
    const dialogRef = this.dialog.open(XmlJsonReportsComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Reports',
        lookup: lookupLst$,
        entryIds: idNumArr,
        hasBackdrop: true,
        translations: this.translations,
        languageArr,
        lang: this.lang
      },
    });

    dialogRef.afterClosed().subscribe();
    this.addXmlJsonRptDialogRef = dialogRef;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
