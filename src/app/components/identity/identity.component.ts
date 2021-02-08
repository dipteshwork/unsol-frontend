import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AddNameDialogComponent } from '../dialog/identity/add-name-dialog/add-name-dialog.component';
import { AddFeatureDialogComponent } from '../dialog/identity/add-feature-dialog/add-feature-dialog.component';
import { AddDocumentDialogComponent } from '../dialog/identity/add-document-dialog/add-document-dialog.component';
import { BiometricDialogComponent } from '../dialog/identity/biometric-dialog/biometric-dialog.component';
import { AddAddressDialogComponent } from '../dialog/identity/add-address-dialog/add-address-dialog.component';
import { AddDobDialogComponent } from '../dialog/identity/add-dob-dialog/add-dob-dialog.component';
import { AddPobDialogComponent } from '../dialog/identity/add-pob-dialog/add-pob-dialog.component';
import { DesigDialogComponent } from '../dialog/identity/desig-dialog/desig-dialog.component';
import { TitleDialogComponent } from '../dialog/identity/title-dialog/title-dialog.component';
import { NationalityDialogComponent } from '../dialog/identity/nationality-dialog/nationality-dialog.component';
import { FeatureData } from '../../models/featureModel';
import { AddressData } from '../../models/addressModel';
import { LookupLst } from '../../classes/lookupLst';
import { SanctionLoadService } from '../../services/sanction-load.service';
import { RemoveDialogComponent } from '../dialog/action/remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent implements OnInit {
  DIALOG_SM: string = window.screen.width > 768 ? '30%' : '80%';
  DIALOG_MD: string = window.screen.width > 768 ? '60%' : '80%';
  idTypes;
  idCategories;
  livingStatuses;
  genders;
  mbrStates;
  entryTypeTh;
  entryTypeUrlFlag;
  fullNameFlag;
  fullNameOrgFlag;
  langConvertGenderObj;
  langConvertLivingStatusObj;
  title = 'app';

  names: FormArray = new FormArray([]);
  nameOrgSpt: FormArray = new FormArray([]);
  address: FormArray = new FormArray([]);
  dobs: FormArray = new FormArray([]);
  docs: FormArray = new FormArray([]);
  pobs: FormArray = new FormArray([]);
  features: FormArray = new FormArray([]);
  nationaltty: FormArray = new FormArray([]);
  titles: FormArray = new FormArray([]);
  desigs: FormArray = new FormArray([]);
  biometricInf: FormArray = new FormArray([]);
  namesDataSrc = new MatTableDataSource();
  nameOrgScptDataSrc = new MatTableDataSource();

  pobsDataSrc = new MatTableDataSource();
  addrDataSrc = new MatTableDataSource();
  featDataSrc = new MatTableDataSource();
  docDataSrc = new MatTableDataSource();
  bioMDataSrc = new MatTableDataSource();
  dobsDataSrc = new MatTableDataSource();
  nationaltyDataSrc = new MatTableDataSource();
  desigDataSrc = new MatTableDataSource();
  titleDataSrc = new MatTableDataSource();

  namesDisplayedColumnsArr: any[] = [
    { property: 'name', name: 'Name' },
    { property: 'nameType', name: 'NameType' },
    { property: 'order', name: 'Order' },
    { property: 'script', name: 'Script' },
  ];
  namesToBDisplayedCols: any[] = [];
  namesDisplayedColumns: string[] = this.namesDisplayedColumnsArr.map(
    (x) => x.property
  );

  nameOrgScrpDisplayedColumns: string[] = this.namesDisplayedColumns;
  pobDisplayedColumnsArr: any[] = [
    { property: 'type', name: 'Type' },
    { property: 'countryRegion', name: 'Address/Location' },
    { property: 'notes', name: 'Notes' },
  ];

  addrDisplayedColumnsArr = this.pobDisplayedColumnsArr;
  pobDisplayedColumns: string[] = this.pobDisplayedColumnsArr.map(
    (x) => x.property
  );
  addrDisplayedColumns: string[] = this.pobDisplayedColumnsArr.map(
    (x) => x.property
  );
  featDisplayedColumnsArr: any[] = [
    { property: 'featureType', name: 'Type' },
    { property: 'fValue', name: 'Value' },
  ];
  featDisplayedColumns: string[] = this.featDisplayedColumnsArr.map(
    (x) => x.property
  );
  docDisplayedColumnsArr: any[] = [
    { property: 'docNum', name: 'Document Num' },
    { property: 'docType', name: 'Type' },
    { property: 'issuingCntry', name: 'Issuing country' },
  ];
  docDisplayedColumns: string[] = this.docDisplayedColumnsArr.map(
    (x) => x.property
  );
  bioMDisplayedColumnsArr: any[] = [
    { property: 'bioMType', name: 'Type' },
    { property: 'bioMVal', name: 'Value' },
    { property: 'bioMNote', name: 'Note' },
    { property: 'bioMAttch', name: '' },
  ];
  bioMDisplayedColumns: string[] = this.bioMDisplayedColumnsArr.map(
    (x) => x.property
  );
  dobsDisplayedColumnsArr: any[] = [
    { property: 'dobType', name: 'Type' },
    // {'property': 'dobSubset', 'name': 'Subset'},
    // {'property': 'dobSubsetDte', 'name': 'SubsetDte'},
    // {'property': 'dobSpecDte', 'name': 'Specific Date'},
    { property: 'dobDate', name: 'Date' },
    { property: 'dobNote', name: 'Note' },
  ];
  dobsDisplayedColumns: string[] = this.dobsDisplayedColumnsArr.map(
    (x) => x.property
  );
  nationaltyDisplayedColumnsArr: any[] = [
    { property: 'nation', name: 'Nationality' },
    { property: 'nationalNote', name: 'Note' },
  ];
  titleDisplayedColumnsArr: any[] = [
    { property: 'title', name: 'Title' },
  ];
  titleDisplayedColumns: string[] = this.titleDisplayedColumnsArr.map(
    (x) => x.property
  );
  desigDisplayedColumnsArr: any[] = [
    { property: 'designation', name: 'Designation' },
  ];
  desigDisplayedColumns: string[] = this.desigDisplayedColumnsArr.map(
    (x) => x.property
  );
  nationaltyDisplayedColumns: string[] = this.nationaltyDisplayedColumnsArr.map(
    (x) => x.property
  );
  nameDialogOrdNumbUsedArr = [];
  nameDialogTypeArr = [];
  biometricTypesUsedArr = [];
  nameOrgScptDialogOrdNumbUsedArr = [];
  nameOrgScptDialogNameTypeArr = [];
  public identityForm: FormGroup;
  concatedName: '';
  concatedOrgName: '';

  @Input('sanctionForm') sanctionForm: FormGroup;
  @Input('id') id: number;
  @Input('lkupSrv') lookupLst$: LookupLst;
  @Input('entryTyp') entryTyp: string;
  @Input('tabData') tabData: any;
  @Input('isReadOnly') isReadOnly: boolean;
  @Input('isFreeTextEditable') isFreeTextEditable: boolean;
  @Input('isCreateMode') isCreateMode: boolean;
  @Input('isTranslationMode') isTranslationMode: boolean;
  @Input('sancStatus') sancStatus: string;
  @Input('lang') lang: string;
  @Input('translations') translations: {};
  @Input('isEditableLiviginStatusAndGender') isEditableLiviginStatusAndGender: boolean;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private sancLoadSvc: SanctionLoadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.entryTypeUrlFlag = param.entryTypeName ? true : false;
    });
    this.sanctionForm;
    this.idTypes = this.getIdentityType();
    this.idCategories = this.getIdentityCategory();
    this.genders = this.getGender();
    this.livingStatuses = this.getLivngStatus();
    this.mbrStates = this.getMembrState();
    this.namesToBDisplayedCols = this.namesDisplayedColumns;
    this.entryTypeTh = this.getEntryTypeIndividual();
    this.fullNameFlag = this.tabData ? this.readAllNameTypeUsed(this.tabData.names.names).includes('FULL_NAME') : false;
    this.fullNameOrgFlag = this.tabData ? this.readAllNameTypeUsed(this.tabData.names.nameOrgSpt).includes('FULL_NAME') : false;
    if (this.tabData) {
      this.langConvertGenderObj = this.genders.find(item => Object.values(item).some((v: any) => v.genderName === this.tabData.genderStatus));
      this.langConvertLivingStatusObj = this.livingStatuses.find(item => Object.values(item).some((v: any) => v.livingStatusName === this.tabData.livingStatus));
    }

    if (this.tabData != null && this.tabData != undefined) {
      this.namesDataSrc.data = this.tabData.names.names;
      this.nameOrgScptDataSrc.data = this.tabData.names.nameOrgSpt;
      this.pobsDataSrc.data = this.tabData.pobs;
      this.addrDataSrc.data = this.tabData.address;
      this.featDataSrc.data = this.tabData.features;
      this.docDataSrc.data = this.tabData.docs;
      this.bioMDataSrc.data = this.tabData.biometricInf;
      this.dobsDataSrc.data = this.populateDobTbl();
      this.nationaltyDataSrc.data = this.createNationaltyDataSrc();
      this.desigDataSrc.data = this.createDesigDataSrc();
      this.titleDataSrc.data = this.createTitleDataSrc();
      this.identityForm = this.fb.group({
        names: this.readInAndSetNames(),
        nameOrgSpt: this.readInAndSetNameOrgScrpt(),
        dobs: this.readInAndSetDobs(),
        docs: this.readInAndSetDocs(),
        genderStatus: this.createGenderStatus(this.tabData.genderStatus, this.tabData.livingStatus),
        pobs: this.readInAndSetPobs(),
        address: this.readInAndSetAddrs(),
        features: this.readInAndSetFeats(),
        nationalttY: this.readInAndSetNationality(),
        biometricInf: this.readInAndSetBioM(),
        category: [
          {
            value: this.tabData.category,
            disabled: this.tabData.idType == 'PRIMARY' ? true : false,
          },
          [Validators.required, Validators.pattern('^((?!Select).)*$')],
        ],
        idComment: this.tabData.comment,
        idType: [
          {
            value: this.tabData.idType,
            disabled: this.tabData.idType == 'PRIMARY' ? true : false,
          },
          [Validators.required, Validators.pattern('^((?!Select).)*$')],
        ],
        idTitle: this.readInAndSetTitles(),
        idTitleSingle: this.tabData.idTitle.title[0],
        idDesig: this.readInAndSetDesigs(),
      });
    } else {
      this.identityForm = this.fb.group({
        names: this.fb.array([], Validators.required),
        nameOrgSpt: this.fb.array([]),
        dobs: this.fb.array([]),
        docs: this.fb.array([]),
        genderStatus: this.createGenderStatus('', ''),
        pobs: this.fb.array([]),
        address: this.fb.array([]),
        features: this.fb.array([]),
        nationalttY: this.fb.array([]),
        biometricInf: this.fb.array([]),
        category: [
          {
            value: this.id == 0 ? 'High' : null,
            disabled: this.id == 0 ? true : false,
          },
          [Validators.required, Validators.pattern('^((?!Select).)*$')],
        ],
        idComment: '',
        idType: [
          {
            value: this.id == 0 ? 'PRIMARY' : null,
            disabled: this.id == 0 ? true : false,
          },
          [Validators.required, Validators.pattern('^((?!Select).)*$')],
        ],
        idTitle: this.fb.array([]),
        idTitleSingle: '',
        idDesig: this.fb.array([]),
      });
    }

    this.namesDisplayedColumnsArr = [
      { property: 'name', name: this.getTranslation('Name') },
      { property: 'nameType', name: this.getTranslation('NameType') },
      { property: 'order', name: this.getTranslation('Order') },
      { property: 'script', name: this.getTranslation('Script') },
    ];

    this.pobDisplayedColumnsArr = [
      { property: 'type', name: this.getTranslation('Type') },
      {
        property: 'countryRegion',
        name:
          this.getTranslation('Address') +
          '/' +
          this.getTranslation('Location'),
      },
      { property: 'notes', name: this.getTranslation('Notes') },
    ];

    this.featDisplayedColumnsArr = [
      { property: 'fStatus', name: this.getTranslation('Status') },
      { property: 'fValue', name: this.getTranslation('Value') },
      { property: 'featureType', name: this.getTranslation('Type') },
    ];

    this.docDisplayedColumnsArr = [
      { property: 'docNum', name: this.getTranslation('Document Num') },
      { property: 'docType', name: this.getTranslation('Type') },
      {
        property: 'issuingCntry',
        name: this.getTranslation('Issuing country'),
      },
    ];

    this.bioMDisplayedColumnsArr = [
      { property: 'bioMType', name: this.getTranslation('Type') },
      { property: 'bioMVal', name: this.getTranslation('Value') },
      { property: 'bioMNote', name: this.getTranslation('Note') },
      { property: 'bioMAttch', name: this.getTranslation('') },
    ];

    this.dobsDisplayedColumnsArr = [
      { property: 'dobType', name: this.getTranslation('Type') },
      { property: 'dobDate', name: this.getTranslation('Date') },
      { property: 'dobNote', name: this.getTranslation('Note') },
    ];

    this.nationaltyDisplayedColumnsArr = [
      { property: 'nation', name: this.getTranslation('Nationality') },
      { property: 'nationalNote', name: this.getTranslation('Note') },
    ];

    this.titleDisplayedColumnsArr = [
      { property: 'title', name: this.getTranslation('Title') },
    ];

    this.desigDisplayedColumnsArr = [
      { property: 'designation', name: this.getTranslation('Designation') },
    ];

    this.pobDisplayedColumnsArr = [
      { property: 'type', name: this.getTranslation('Type') },
      {
        property: 'countryRegion',
        name: `${this.getTranslation('Address')}/${this.getTranslation('Location')}`,
      },
      { property: 'notes', name: this.getTranslation('Note') },
    ];

    this.addrDisplayedColumnsArr = [...this.pobDisplayedColumnsArr];
    this.pobDisplayedColumns = this.pobDisplayedColumnsArr.map(
      (x) => x.property
    );
    this.addrDisplayedColumns = this.pobDisplayedColumnsArr.map(
      (x) => x.property
    );

    this.changeTblRowDisp(this.tabData != null && this.tabData != undefined);
  }

  changeTblRowDisp(isReadOnly) {
    this.isReadOnly = isReadOnly;
    if (this.isReadOnly) {
      if (this.namesToBDisplayedCols.includes('editColumn')) {
        this.namesToBDisplayedCols.pop();
        this.namesDisplayedColumnsArr.pop();
        this.nationaltyDisplayedColumns.pop();
        this.nationaltyDisplayedColumnsArr.pop();
        this.titleDisplayedColumns.pop();
        this.titleDisplayedColumnsArr.pop();
        this.desigDisplayedColumns.pop();
        this.desigDisplayedColumnsArr.pop();
        this.docDisplayedColumns.pop();
        this.docDisplayedColumnsArr.pop();
        this.bioMDisplayedColumns.pop();
        this.bioMDisplayedColumnsArr.pop();
        this.dobsDisplayedColumns.pop();
        this.dobsDisplayedColumnsArr.pop();
        this.pobDisplayedColumns.pop();
        this.pobDisplayedColumnsArr.pop();
        this.featDisplayedColumns.pop();
        this.featDisplayedColumnsArr.pop();
        this.addrDisplayedColumns.pop();
        this.addrDisplayedColumnsArr.pop();
      }
    } else {
      if (this.namesToBDisplayedCols.includes('editColumn')) {
        this.namesToBDisplayedCols.pop();
        this.namesDisplayedColumnsArr.pop();
        this.nationaltyDisplayedColumns.pop();
        this.nationaltyDisplayedColumnsArr.pop();
        this.titleDisplayedColumns.pop();
        this.titleDisplayedColumnsArr.pop();
        this.desigDisplayedColumns.pop();
        this.desigDisplayedColumnsArr.pop();
        this.docDisplayedColumns.pop();
        this.docDisplayedColumnsArr.pop();
        this.bioMDisplayedColumns.pop();
        this.bioMDisplayedColumnsArr.pop();
        this.dobsDisplayedColumns.pop();
        this.dobsDisplayedColumnsArr.pop();
        this.pobDisplayedColumns.pop();
        this.pobDisplayedColumnsArr.pop();
        this.featDisplayedColumns.pop();
        this.featDisplayedColumnsArr.pop();
        this.addrDisplayedColumns.pop();
        this.addrDisplayedColumnsArr.pop();
      } else {
        this.namesToBDisplayedCols.push('editColumn');
        this.namesDisplayedColumnsArr.push({
          property: 'editColumn',
          name: '',
        });
        this.nationaltyDisplayedColumns.push('editColumn');
        this.nationaltyDisplayedColumnsArr.push({
          property: 'editColumn',
          name: '',
        });
        this.titleDisplayedColumns.push('editColumn');
        this.titleDisplayedColumnsArr.push({
          property: 'editColumn',
          name: '',
        });
        this.desigDisplayedColumns.push('editColumn');
        this.desigDisplayedColumnsArr.push({
          property: 'editColumn',
          name: '',
        });
        this.docDisplayedColumns.push('editColumn');
        this.docDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
        this.bioMDisplayedColumns.push('editColumn');
        this.bioMDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
        this.dobsDisplayedColumns.push('editColumn');
        this.dobsDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
        this.pobDisplayedColumns.push('editColumn');
        this.pobDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
        this.featDisplayedColumns.push('editColumn');
        this.featDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
        this.addrDisplayedColumns.push('editColumn');
        this.addrDisplayedColumnsArr.push({ property: 'editColumn', name: '' });
      }
    }
  }

  populateDobTbl() {
    const dobsInfArr = this.tabData.dobs;
    const dobsDatSrcArr = dobsInfArr.map((dobInf) => {
      let dobDate: string = dobInf.dobSpecDte
        ? dobInf.dobSpecDte
        : dobInf.dobSubsetDte;
      if (dobDate) {
        dobDate = this.parseToDate(dobDate);
      } else {
        dobDate =
          this.parseToDate(dobInf.dobFrom) +
          '; ' +
          this.parseToDate(dobInf.dobTo);
      }
      return {
        dobNote: dobInf.dobNote,
        dobDate: dobDate,
        dobSubset: dobInf.dobSubset,
        dobTo: dobInf.dobTo,
        dobFrom: dobInf.dobFrom,
        dobSubsetType: dobInf.dobSubsetType,
        dobType: dobInf.dobType,
      };
    });
    return dobsDatSrcArr;
  }

  trackByNameIndex(i) {
    return i;
  }
  trackByNationalityIndex(i) {
    return i;
  }
  trackByDesignationIndex(i) {
    return i;
  }
  trackByDocIndex(i) {
    return i;
  }
  trackByBioIndex(i) {
    return i;
  }
  trackByPOBIndex(i) {
    return i;
  }
  trackByDOBIndex(i) {
    return i;
  }
  trackByAddrIndex(i) {
    return i;
  }
  trackByFeatsIndex(i) {
    return i;
  }

  addNameOrgSptDialogRef: MatDialogRef<AddNameDialogComponent>;
  openNameOrgSptDialog(): void {
    if (!this.isReadOnly) {
      this.nameOrgScptDialogOrdNumbUsedArr = this.readAllNameOrdrNumbersUsed(
        this.nameOrgScptDataSrc.data
      );
      this.nameOrgScptDialogNameTypeArr = this.readAllNameTypeUsed(
        this.nameOrgScptDataSrc.data
      );
      const dialogRef = this.dialog.open(AddNameDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add name in original script',
          ordNumUsedArr: this.nameOrgScptDialogOrdNumbUsedArr,
          nameTypeArr: this.nameOrgScptDialogNameTypeArr,
          nameType:
            (this.entryTyp == this.entryTypeTh)
              ? this.lookupLst$.nameOrgSptType[this.lang]
              : 'FULL_NAME',
          script: this.lookupLst$.scriptType[this.lang],
          isReadOnly: this.isReadOnly,
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result: DialogData) => {
        if (result) {
          this.addNameOrgSpt(result);
          this.nameOrgScptDataSrc.data = this.nameOrgSpt.value;
          this.fullNameFlag = this.nameOrgSpt.value ? this.readAllNameTypeUsed(this.nameOrgSpt.value).includes('FULL_NAME') : false;
          this.cd.detectChanges();
        }
      });
      this.addNameOrgSptDialogRef = dialogRef;
    }
  }

  addNameDialogRef: MatDialogRef<AddNameDialogComponent>;
  openDialog(): void {
    if (!this.isReadOnly) {
      this.nameDialogOrdNumbUsedArr = this.readAllNameOrdrNumbersUsed(
        this.namesDataSrc.data
      );
      this.nameDialogTypeArr = this.readAllNameTypeUsed(this.namesDataSrc.data);

      const dialogRef = this.dialog.open(AddNameDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add name',
          ordNumUsedArr: this.nameDialogOrdNumbUsedArr,
          nameTypeArr: this.nameDialogTypeArr,
          // nameTypeValue: this.lookupLst$.entryType[1][this.lang] || '',
          nameType:
            (this.entryTyp == this.entryTypeTh)
              ? this.lookupLst$.nameOrgSptType[this.lang]
              : 'FULL_NAME',
          script: this.lookupLst$.scriptType[this.lang],
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result: DialogData) => {
        if (result) {
          this.addName(result);
          this.namesDataSrc.data = this.names.value;
          this.fullNameFlag = this.names.value ? this.readAllNameTypeUsed(this.names.value).includes('FULL_NAME') : false;
          this.cd.detectChanges();
        }
      });
      this.addNameDialogRef = dialogRef;
    }
  }

  createNationaltyDataSrc() {
    return this.tabData.nationaltty.nationality.map((tmpNationalty) => ({
      countrytoChoose: {
        nation: tmpNationalty['nation'],
        nationalNote: tmpNationalty['nationalNote'],
      },
    }));
  }

  createTitleDataSrc() {
    return this.tabData.idTitle.title.map((tmpDesig) => ({
      title: tmpDesig,
    }));
  }

  createDesigDataSrc() {
    return this.tabData.idDesig.designation.map((tmpDesig) => ({
      designation: tmpDesig,
    }));
  }

  readAllBiometricTypesUsed() {
    const biomTypArr = this.identityForm.controls.biometricInf.value;
    return biomTypArr.map((biomTyp) => biomTyp['bioMType']);
  }

  readAllNameOrdrNumbersUsed(tmp) {
    const nameOrdNumUser = [];
    for (let i = 0; i < tmp.length; i++) {
      nameOrdNumUser.push(tmp[i].order);
    }
    return nameOrdNumUser;
  }

  readAllNameTypeUsed(tmp) {
    const nameType = [];
    for (let i = 0; i < tmp.length; i++) {
      nameType.push(tmp[i].nameType);
    }
    return nameType;
  }

  addNameOrgSpt(nameDialog): void {
    this.concatedOrgName = '';
    this.nameOrgSpt = this.identityForm.get('nameOrgSpt') as FormArray;
    this.nameOrgSpt.push(this.fb.group(nameDialog));
    this.sortConcatedOrgName();
  }

  sortConcatedOrgName(): void {
    this.concatedOrgName = '';
    this.nameOrgSpt = this.identityForm.get('nameOrgSpt') as FormArray;
    const nameOrgValues = [...this.nameOrgSpt.controls];
    const concatedOrgNameArr = nameOrgValues.sort(
      (a, b) => a['value']['order'] - b['value']['order']
    );
    for (let i = 0; i < concatedOrgNameArr.length; i++) {
      this.concatedOrgName += ' ' + concatedOrgNameArr[i]['value']['name'];
    }
  }

  addName(nameDialog): void {
    this.concatedName = '';
    this.names = this.identityForm.get('names') as FormArray;
    this.names.push(this.fb.group(nameDialog));
    this.sortConcatedName();
  }

  sortConcatedName(): void {
    this.concatedName = '';
    this.names = this.identityForm.get('names') as FormArray;
    const nameValues = [...this.names.controls];
    const concatedNameArr = nameValues.sort(
      (a, b) => a['value']['order'] - b['value']['order']
    );
    for (let i = 0; i < concatedNameArr.length; i++) {
      this.concatedName += ' ' + concatedNameArr[i]['value']['name'];
    }
  }

  addBiometricInf(biometricDialog): void {
    this.biometricInf = this.identityForm.get('biometricInf') as FormArray;
    const totalAttachments = biometricDialog['bioMAttch'].length;

    const newForm = new FormGroup({
      bioMType: new FormControl(
        biometricDialog['bioMType'],
        RxwebValidators.unique()
      ),
      bioMVal: new FormControl(biometricDialog['bioMVal']),
      bioMAttch: new FormControl(biometricDialog['bioMAttch']),
      bioMNote: new FormControl(biometricDialog['bioMNote']),
      bioMDeletes: new FormControl(biometricDialog['fileIdsToBeDeleted']),
      bioMPrevAttchs: new FormControl(biometricDialog['prevAttchs']),
      bioMTabId: new FormControl(this.id),
      bioMTotalAttchs: new FormControl(totalAttachments),
    });

    this.biometricInf.push(newForm);
    this.bioMDataSrc.data = this.biometricInf.value;
    this.cd.detectChanges();
  }

  addDob(dobDialog): void {
    this.dobs = this.identityForm.get('dobs') as FormArray;
    let subsetDte = null;
    let specDte = null;
    let dobAdded = null;
    if (dobDialog.dobType == 'Range') {
      if (dobDialog.dobSubsetType != null) {
        const moment = dobDialog.dobSubsetDte._i;
        if (dobDialog.dobSubsetType == 'yyyy') {
          dobDialog.dobSubsetDte;
          subsetDte = '' + moment.year;
        } else if (dobDialog.dobSubsetType == 'mmyyyy') {
          const mnth: number = moment.month;
          const mnther = mnth + 1;
          subsetDte = '' + moment.year + '/' + mnther;
        }
      } else {
        const dobFrom =
          dobDialog.dobFrom &&
          dobDialog.dobFrom._i.year +
            '/' +
            (dobDialog.dobFrom._i.month + 1) +
            '/' +
            dobDialog.dobFrom._i.date;
        const dobTo =
          dobDialog.dobTo &&
          dobDialog.dobTo._i.year +
            '/' +
            (dobDialog.dobTo._i.month + 1) +
            '/' +
            dobDialog.dobTo._i.date;
        // subsetDte = dobFrom + '; ' + dobTo;
        subsetDte = 'From ' + dobFrom + ' to ' + dobTo;
      }
      dobAdded = {
        dobNote: dobDialog.dobNote,
        dobDate: subsetDte,
        dobSubset: dobDialog.dobSubset,
        dobSubsetType: dobDialog.dobSubsetType,
        dobType: dobDialog.dobType,
      };
    } else {
      const specDteMoment = dobDialog.dobSpecDte._i;
      specDte =
        specDteMoment.year +
        '/' +
        (specDteMoment.month + 1) +
        '/' +
        specDteMoment.date;
      dobAdded = {
        dobNote: dobDialog.dobNote,
        dobDate: specDte,
        dobSubset: dobDialog.dobSubset,
        dobSubsetType: dobDialog.dobSubsetType,
        dobType: dobDialog.dobType,
      };
    }

    this.dobs.push(this.fb.group(dobDialog));
    const datax = this.dobsDataSrc.data;
    datax.push(dobAdded);
    this.dobsDataSrc.data = datax;
    this.cd.detectChanges();
  }

  addDoc(docDialog): void {
    this.docs = this.identityForm.get('docs') as FormArray;
    if (docDialog.docType) {
      docDialog.docType = docDialog.docType.toString();
    }
    this.docs.push(this.fb.group(docDialog));
    this.docDataSrc.data = this.docs.value;
    this.cd.detectChanges();
  }

  addPob(pobDialog): void {
    this.pobs = this.identityForm.get('pobs') as FormArray;
    this.pobs.push(this.fb.group(pobDialog));
    this.pobsDataSrc.data = this.pobs.value;
    this.cd.detectChanges();
  }

  addAddress(addrDialog): void {
    this.address = this.identityForm.get('address') as FormArray;
    this.address.push(this.fb.group(addrDialog));
    this.addrDataSrc.data = this.address.value;
    this.cd.detectChanges();
  }

  addFeat(featDialog): void {
    this.features = this.identityForm.get('features') as FormArray;
    this.features.push(this.fb.group(featDialog));
    this.featDataSrc.data = this.features.value;
    this.cd.detectChanges();
  }

  addNationality(nationalttDialog): void {
    this.nationaltty = this.identityForm.get('nationalttY') as FormArray;

    this.nationaltty.push(this.fb.group(nationalttDialog));
    const tmpNaitonaltyData = this.nationaltyDataSrc.data;
    tmpNaitonaltyData.push(nationalttDialog);
    this.nationaltyDataSrc.data = tmpNaitonaltyData;
    this.cd.detectChanges();
  }

  getShortName(name, config): string {
    let result = '';
    if (config['property'] === 'nation') {
      result = this.mbrStates.find(
        (item) =>
          item.UN_name ===
          (name['countrytoChoose']
            ? name['countrytoChoose']['nation']
            : name['nation'])
      )['Short_name'];
    } else {
      result = name['countrytoChoose']
        ? name['countrytoChoose'][config['property']]
        : name[config['property']];
    }
    return result;
  }

  addTitles(dialog): void {
    this.titles = this.identityForm.get('idTitle') as FormArray;
    this.titles.push(new FormControl(dialog['title']));
    const tmpDesigsData = this.titleDataSrc.data;
    tmpDesigsData.push(dialog);
    this.titleDataSrc.data = tmpDesigsData;
    this.cd.detectChanges();
  }

  addDesigs(desigDialog): void {
    this.desigs = this.identityForm.get('idDesig') as FormArray;

    this.desigs.push(new FormControl(desigDialog['designation']));
    const tmpDesigsData = this.desigDataSrc.data;
    tmpDesigsData.push(desigDialog);
    this.desigDataSrc.data = tmpDesigsData;
    this.cd.detectChanges();
  }

  createDob(): FormGroup {
    return this.fb.group({
      type: new FormControl(null, Validators.required),
      dobSubset: new FormControl(null, Validators.required),
      dobSpecDte: '',
      dobFrom: '',
      dobTo: '',
      dobType: new FormControl(''),
      dobNote: new FormControl('', Validators.required),
    });
  }

  createDocs(): FormGroup {
    return this.fb.group({
      docNum: '',
      docType: '',
      docTyp1: new FormControl(null),
      issueDte: new FormControl(null),
      expDte: '',
      issuingCntry: '',
      issuedCntry: '',
      issuingCity: new FormControl(''),
      note: '',
    });
  }

  createGenderStatus(genderStat: string, livngStat: string): FormGroup {
    return this.fb.group({
      gender: [
        {
          genderName: genderStat,
          isActive: true,
        },
      ],
      livngStat: [
        {
          livingStatusName: livngStat,
          isActive: true,
        },
      ],
    });
  }

  createPobs(): FormGroup {
    return this.fb.group({
      street: new FormControl(' '),
      city: '',
      title: '',
      stateProv: '',
      zipCde: '',
      region: '',
      lat: '',
      lng: '',
      note: '',
      locOptions: '',
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipCde: new FormControl(''),
      country: new FormControl(''),
      region: new FormControl(''),
      stateProv: new FormControl(''),
      lat: new FormControl('', Validators.required),
      lng: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
      locOptions: '',
    });
  }

  createFeature(): FormGroup {
    return this.fb.group({
      featureType: '',
      fStatus: '',
      fValue: '',
      fNotes: '',
      title: '',
    });
  }

  createNationalitee(): FormGroup {
    return this.fb.group({
      nationality: new FormControl(''),
    });
  }

  createBiometricInf(): FormGroup {
    return this.fb.group({
      bioMType: '',
      bioMVal: '',
      bioMAttch: '',
      bioMNote: new FormControl(''),
    });
  }

  addAddrDialogRef: MatDialogRef<AddAddressDialogComponent>;
  openAddrDialog(): void {
    if (!this.isReadOnly) {
      const dialogRef = this.dialog.open(AddAddressDialogComponent, {
        width: this.DIALOG_MD,
        data: {
          title: 'Add Address',
          country: this.getMembrState(),
          locOptions: 'Male',
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      dialogRef
        .afterClosed()
        .pipe(
          filter(function (addrDatum) {
            return addrDatum;
          })
        )
        .subscribe((addrDatum: AddressData) => this.addAddress(addrDatum));

      this.addAddrDialogRef = dialogRef;
    }
  }

  addDobDialogRef: MatDialogRef<AddDobDialogComponent>;
  openDobDialog(): void {
    if (!this.isReadOnly) {
      const dobDialogRef = this.dialog.open(AddDobDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add date of birth',
          isFreeTextEditable: this.isFreeTextEditable,
          lang: this.lang,
          translations: this.translations
        },
        hasBackdrop: true
      });

      dobDialogRef
        .afterClosed()
        .pipe(
          filter(function(dobDatum) {
            return dobDatum;
          })
        )
        .subscribe((dobDatum: DobDialogData) => this.addDob(dobDatum));
      this.addDobDialogRef = dobDialogRef;
    }
  }

  biometricDialogRef: MatDialogRef<BiometricDialogComponent>;
  openAddBiometricDialog() {
    this.biometricTypesUsedArr = this.readAllBiometricTypesUsed();
    const biometricDialogRef = this.dialog.open(BiometricDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Add biometric',
        biometricTypesUsedArr: this.biometricTypesUsedArr,
        biometricTypes: this.lookupLst$.biometricType,
        // biometricTypes: this.getBiometricTypeKeys(),
        biometricObj: this.lookupLst$.biometricType,
        isReadOnly: this.isReadOnly,
        tabId: this.id,
        isFreeTextEditable: this.isFreeTextEditable,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    biometricDialogRef
      .afterClosed()
      .pipe(
        filter(function (biometricDatum) {
          if (biometricDatum) {
            return biometricDatum;
          }
        })
      )
      .subscribe((biometricDatum: BiometricDialogData) =>
        this.addBiometricInf(biometricDatum)
      );
    this.biometricDialogRef = biometricDialogRef;
  }

  docDialogRef: MatDialogRef<AddDocumentDialogComponent>;
  openDocDialog(): void {
    if (!this.isReadOnly) {
      const docDialogRef = this.dialog.open(AddDocumentDialogComponent, {
        width: this.DIALOG_MD,
        data: {
          title: 'Add document',
          docType: this.lookupLst$.docType1.filter((item) => (Object.keys(item)[0] == this.lang.toUpperCase()))[0][this.lang.toUpperCase()],
          country: this.lookupLst$.un_country_list['record'],
          issuingCntry: this.lookupLst$.un_country_list['record'],
          issuedCntry: this.lookupLst$.un_country_list['record'],
          isReadOnly: this.isReadOnly,
          lang: this.lang,
          translations: this.translations,
          isFreeTextEditable: this.isFreeTextEditable,
          isTranslationMode: this.isTranslationMode,
        },
        hasBackdrop: true,
      });

      docDialogRef.afterClosed().subscribe((result: docDialogData) => {
        if (result != null || result !== undefined) {
          this.addDoc(result);
          this.docDataSrc.data = this.docs.value;
        }
      });
      this.docDialogRef = docDialogRef;
    }
  }

  featDialogRef: MatDialogRef<AddFeatureDialogComponent>;
  openFeatureDialog(): void {
    if (!this.isReadOnly) {
      const featDialogRef = this.dialog.open(AddFeatureDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add feature',
          featureTypes: this.getFeatures(),
          isReadOnly: this.isReadOnly,
          fStatus: this.getFeaturesStatus(),
          lang: this.lang,
          translations: this.translations,
          isFreeTextEditable: this.isFreeTextEditable,
          isTranslationMode: this.isTranslationMode,
        },
        hasBackdrop: true,
      });

      featDialogRef
        .afterClosed()
        .pipe(
          filter(function (featDatum) {
            return featDatum;
          })
        )
        .subscribe((featDatum: FeatureData) => this.addFeat(featDatum));

      this.featDialogRef = featDialogRef;
    }
  }

  pobDialogRef: MatDialogRef<AddPobDialogComponent>;
  openPobDialog(): void {
    if (!this.isReadOnly) {
      const pobDialogRef = this.dialog.open(AddPobDialogComponent, {
        width: this.DIALOG_MD,
        data: {
          title: 'Add Place of birth',
          cntry: this.getMembrState(),
          locOptions: 'Male',
          isReadOnly: this.isReadOnly,
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      pobDialogRef
        .afterClosed()
        .pipe(
          filter(function (pobDatum) {
            return pobDatum;
          })
        )
        .subscribe((pobDatum: PobDialogData) => this.addPob(pobDatum));
      this.pobDialogRef = pobDialogRef;
    }
  }

  getIdentityCategory(): any[] {
    const activeCategories = this.lookupLst$.idCategory.filter((item) => item[this.lang.toUpperCase()]['isActive']);
    return activeCategories;
  }

  getIdentityCategoryVals(key): string[] {
    return key;
  }

  getEntryTypeIndividual(): string[] {
    const tmp = this.lookupLst$['entryType'].filter((item) => item['EN']['entryTypeName'] === 'Individual')[0];
    return tmp[this.lang]['entryTypeName'];
  }

  getIdentityType(): string[] {
    const activeIdType = this.lookupLst$.idType.filter((item) => item[this.lang.toUpperCase()]['isActive']);
    return activeIdType;
  }

  getIdentityTypeVals(key): string {
    return key;
  }

  getFeatures(): string[] {
    const tmp = this.lookupLst$['features'];
    return tmp;
  }

  getFeaturesStatus(): string[] {
    const fStatus = this.lookupLst$['featuresStatus'];
    return fStatus ? fStatus[0]['EN'] : [null];
  }

  getLivngStatus(): string[] {
    const activeLivingStatus = this.lookupLst$.livingStatus.filter((item) => item[this.lang.toUpperCase()]['isActive']);
    return activeLivingStatus;
  }

  getGender(): string[] {
    const activeGender = this.lookupLst$.gender.filter((item) => item[this.lang.toUpperCase()]['isActive']);
    return activeGender;
  }

  getMembrState(): [{}] {
    const tmp1 = this.lookupLst$.un_country_list['record'];
    const result = tmp1.map((cntrys) => ({
      UN_name: cntrys.UN_name,
      Short_name: cntrys.en_Short,
    }));
    return result;
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      console.log('the identity form is invalid because ', form.errors);
    }
  }

  getBiometricTypeKeys(): string[] {
    const tmp = this.lookupLst$.biometricType;
    return Object.keys(tmp);
  }

  createName(): FormGroup {
    return this.fb.group({
      nameType: new FormControl('', Validators.required),
      order: '',
      script: '',
      name: '',
    });
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  readInAndSetNames() {
    this.concatedName = '';
    const nameArr = this.tabData.names.names;
    const concatedNameArr = nameArr.sort((a, b) => a.order - b.order);
    const result = [];
    for (let i = 0; i < concatedNameArr.length; i++) {
      result.push(this.fb.group(nameArr[i]));
      this.concatedName += ' ' + nameArr[i]['name'];
    }
    return this.fb.array(result, Validators.required);
  }

  readInAndSetNameOrgScrpt() {
    this.concatedOrgName = '';
    const nameOrgSptArr = this.tabData.names.nameOrgSpt;
    const concatedOrgNameArr = nameOrgSptArr.sort((a, b) => a.order - b.order);
    const result = [];
    for (let i = 0; i < concatedOrgNameArr.length; i++) {
      result.push(this.fb.group(nameOrgSptArr[i]));
      this.concatedOrgName += ' ' + nameOrgSptArr[i]['name'];
    }
    // if (nameOrgSptArr.length > 0) {
    //   let concatedOrgNameArr = nameOrgSptArr.sort((a, b) => a.order - b.order);
    //   for (let i = 0; i < concatedOrgNameArr.length; i++) {
    //     let nameOrgScptt = {
    //       name: nameOrgSptArr[i]['name'],
    //       script: nameOrgSptArr[i]['script'],
    //       order: 6,
    //       nameType: "FULL_NAME"
    //     };
    //     result.push(this.fb.group(nameOrgScptt));
    //
    //     this.concatedOrgName += ' ' + nameOrgSptArr[i]['name'];
    //     break;
    //   }
    // } else {
    //   let nameOrgScptt = {
    //     name: nameOrgSptArr.name,
    //     script: nameOrgSptArr['script'],
    //     order: 6,
    //     nameType: "FULL_NAME"
    //   };
    //   result.push(this.fb.group(nameOrgScptt));
    //   this.concatedOrgName += ' ' + nameOrgSptArr['name'];
    // }
    return this.fb.array(result);
  }

  readInAndSetDocs() {
    const docsArr = this.tabData.docs;
    const result = [];
    for (let i = 0; i < docsArr.length; i++) {
      result.push(this.fb.group(docsArr[i]));
    }
    return this.fb.array(result);
  }

  readInAndSetBioM() {
    const bioArr = this.tabData.biometricInf;
    const result = [];

    if (bioArr) {
      for (let i = 0; i < bioArr.length; i++) {
        let bioMAttches = null;
        const bioMArr: FormArray = this.fb.array([]);
        let attchmnt: FormGroup;

        if (bioArr[i].bioMAttch) {
          bioMAttches = bioArr[i].bioMAttch;
          bioMAttches.map((bioMAttch) => {
            attchmnt = new FormGroup({
              filename: new FormControl(bioMAttch.filename),
              filesize: new FormControl(bioMAttch.filesize),
              fileId: new FormControl(bioMAttch.fileId),
              fileTyp: new FormControl(''),
            });
            bioMArr.push(attchmnt);
          });
        }
        result.push(
          this.fb.group({
            bioMType: bioArr[i].bioMType,
            bioMNote: bioArr[i].bioMNote,
            bioMVal: bioArr[i].bioMVal,
            bioMAttch: bioMArr,
            bioMTabId: this.tabData.tabId,
            bioMDeletes: [],
          })
        );
      }
    }
    return this.fb.array(result);
  }

  readInAndSetDobs() {
    const dobsArr = this.tabData.dobs;
    const result = [];
    for (let i = 0; i < dobsArr.length; i++) {
      dobsArr[i].dobFrom = dobsArr[i].dobFrom
        ? this.parseToDate(dobsArr[i].dobFrom)
        : '';
      dobsArr[i].dobTo = dobsArr[i].dobTo
        ? this.parseToDate(dobsArr[i].dobTo)
        : '';
      dobsArr[i].dobSpecDte = dobsArr[i].dobSpecDte
        ? this.parseToDate(dobsArr[i].dobSpecDte)
        : '';
      dobsArr[i].dobSubsetDte = dobsArr[i].dobSubsetDte
        ? this.parseToDate(dobsArr[i].dobSubsetDte)
        : '';
      result.push(this.fb.group(dobsArr[i]));
    }
    return this.fb.array(result);
  }

  parseToDate(str) {
    const y = str.substr(0, 4),
      m = str.substr(5, 2),
      d = str.substr(8, 2);
    const res = y + '/' + m + '/' + d;
    return res;
  }

  readInAndSetPobs() {
    const pobsArr = this.tabData.pobs;
    const result = [];
    for (let i = 0; i < pobsArr.length; i++) {
      result.push(this.fb.group(pobsArr[i]));
    }
    return this.fb.array(result);
  }

  readInAndSetAddrs() {
    const result = [];
    for (let i = 0; i < this.tabData.address.length; i++) {
      result.push(this.fb.group(this.tabData.address[i]));
    }
    return this.fb.array(result);
  }

  readInAndSetFeats() {
    const featsArr = this.tabData.features;
    const result = [];
    for (let i = 0; i < featsArr.length; i++) {
      result.push(this.fb.group(featsArr[i]));
    }
    return this.fb.array(result);
  }

  readInAndSetTitles() {
    const titles = this.tabData.idTitle.title;
    return this.fb.array(titles);
  }

  readInAndSetDesigs() {
    const desigArr = this.tabData.idDesig.designation;
    return this.fb.array(desigArr);
  }

  readInAndSetNationality() {
    const nationalArr = this.tabData.nationaltty.nationality;
    const tmpNationalty = nationalArr.map(
      (national) => new FormControl(national)
    );
    return this.fb.array(tmpNationalty);
  }

  rowClicked(row: any, index: number, isReadOnly): void {
    this.editNameDialog(row, index, isReadOnly);
  }

  rowDeleteClicked(row: any, index: number, isReadOnly): void {
    this.deleteRowDialog(index, 'name', 'Delete name');
  }

  editNameDialogRef: MatDialogRef<AddNameDialogComponent>;
  editNameDialog(row, index, isReadOnly: boolean): void {
    this.nameDialogOrdNumbUsedArr = this.readAllNameOrdrNumbersUsed(
      this.identityForm.value.names
    );
    this.nameDialogTypeArr = this.readAllNameTypeUsed(
      this.identityForm.value.names
    );

    const dialogRef = this.dialog.open(AddNameDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit name',
        ordNumUsedArr: this.nameDialogOrdNumbUsedArr,
        nameTypeArr: this.nameDialogTypeArr,
        nameType:
          (this.entryTyp == this.entryTypeTh)
            ? this.lookupLst$.nameOrgSptType[this.lang]
            : 'FULL_NAME',
        script: this.lookupLst$.scriptType[this.lang],
        editName: row['name'],
        editOrder: row['order'],
        editNameType: row['nameType'],
        editScript: row['script'],
        editRowIndex: index,
        isReadOnly: isReadOnly,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result != null || result !== undefined) {
        this.editName(result);
        this.namesDataSrc.data = this.names.value;
        this.fullNameFlag = this.names.value ? this.readAllNameTypeUsed(this.names.value).includes('FULL_NAME') : false;
        this.cd.detectChanges();
      }
      this.sortConcatedName();
    });
  }

  editName(editedNameForm) {
    this.names = this.identityForm.get('names') as FormArray;
    this.names.value[editedNameForm.editRowIndex] = {
      name: editedNameForm.name,
      nameType: editedNameForm.nameType,
      script: editedNameForm.script,
      order: editedNameForm.order,
      orderNumUsedArr: editedNameForm.orderNumUsedArr,
    };

    const editNmCtrl = this.identityForm.get([
      'names',
      editedNameForm.editRowIndex,
    ]) as FormControl;
    editNmCtrl.patchValue(this.names.value[editedNameForm.editRowIndex]);
    this.namesDataSrc.data = this.names.value;

    this.cd.detectChanges();
  }

  rowClickedDob(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ): void {
    this.editDobDialog(row, index, isReadOnly, isFreeTextEditable);
  }

  rowClickedDobDelete(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ): void {
    this.deleteRowDialog(index, 'date_birth', 'Delete dates of birth');
  }

  rowClickedNmOrgSpt(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ) {
    this.editNameOrgSptDialog(row, index, isReadOnly, isFreeTextEditable);
  }

  rowClickedNmOrgSptDelete(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ) {
    this.deleteRowDialog(index, 'name_org', 'Delete name original script');
  }

  editNameOrgSptDialogRef: MatDialogRef<AddNameDialogComponent>;
  editNameOrgSptDialog(row, index, isReadOnly, isFreeTextEditable): void {
    this.nameOrgScptDialogOrdNumbUsedArr = this.readAllNameOrdrNumbersUsed(
      this.identityForm.value.nameOrgSpt
    );
    this.nameOrgScptDialogNameTypeArr = this.readAllNameTypeUsed(
      this.identityForm.value.nameOrgSpt
    );
    const dialogRef = this.dialog.open(AddNameDialogComponent, {
      width: this.DIALOG_SM,

      data: {
        title: 'Edit name in original script',
        ordNumUsedArr: this.nameOrgScptDialogOrdNumbUsedArr,
        nameTypeArr: this.nameOrgScptDialogNameTypeArr,
        nameType:
          (this.entryTyp == this.entryTypeTh)
            ? this.lookupLst$.nameOrgSptType[this.lang]
            : 'FULL_NAME',
        script: this.lookupLst$.scriptType[this.lang],
        editName: row['name'],
        editOrder: row['order'],
        editNameType: row['nameType'],
        editScript: row['script'],
        editRowIndex: index,
        isReadOnly: this.isReadOnly,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result != null || result !== undefined) {
        this.editNameOrgSpt(result, index);
        this.nameOrgScptDataSrc.data = this.nameOrgSpt.value;
        this.fullNameFlag = this.nameOrgSpt.value ? this.readAllNameTypeUsed(this.nameOrgSpt.value).includes('FULL_NAME') : false;
        this.cd.detectChanges();
      }
      this.sortConcatedOrgName();
    });
  }

  editNameOrgSpt(editedNameOrgSptForm, index) {
    this.nameOrgSpt = this.identityForm.get('nameOrgSpt') as FormArray;
    this.nameOrgSpt[editedNameOrgSptForm.editRowIndex] = {
      name: editedNameOrgSptForm.name,
      nameType: editedNameOrgSptForm.nameType,
      script: editedNameOrgSptForm.script,
      order: editedNameOrgSptForm.order,
      orderNumUsedArr: editedNameOrgSptForm.orderNumUsedArr,
    };
    const editNmOrgSptCtrl = this.identityForm.get([
      'nameOrgSpt',
      editedNameOrgSptForm.editRowIndex,
    ]) as FormControl;

    editNmOrgSptCtrl.patchValue(
      this.nameOrgSpt[editedNameOrgSptForm.editRowIndex]
    );
    this.nameOrgScptDataSrc.data = this.nameOrgSpt.value;
    this.nameOrgScptDataSrc._updateChangeSubscription();

    this.cd.detectChanges();
  }

  deleteDob(index) {
    this.dobs = this.identityForm.get('dobs') as FormArray;
    this.dobs.removeAt(index);
    this.dobsDataSrc.data.splice(index, 1);
    this.dobsDataSrc._updateChangeSubscription();
  }

  deletePob(index) {
    this.pobs = this.identityForm.get('pobs') as FormArray;
    this.pobs.removeAt(index);
    this.pobsDataSrc.data.splice(index, 1);
    this.pobsDataSrc._updateChangeSubscription();
  }

  deleteAddress(index) {
    this.address = this.identityForm.get('address') as FormArray;
    this.address.removeAt(index);
    this.addrDataSrc.data.splice(index, 1);
    this.addrDataSrc._updateChangeSubscription();
  }

  deleteDoc(index) {
    this.docs = this.identityForm.get('docs') as FormArray;
    this.docs.removeAt(index);
    this.docDataSrc.data.splice(index, 1);
    this.docDataSrc._updateChangeSubscription();
  }

  deleteFeature(index) {
    this.features = this.identityForm.get('features') as FormArray;
    this.features.removeAt(index);
    this.featDataSrc.data.splice(index, 1);
    this.featDataSrc._updateChangeSubscription();
  }

  deleteNation(index) {
    this.nationaltty = this.identityForm.get('nationalttY') as FormArray;
    this.nationaltty.removeAt(index);
    this.nationaltyDataSrc.data.splice(index, 1);
    this.nationaltyDataSrc._updateChangeSubscription();
  }

  deleteDesign(index) {
    this.desigs = this.identityForm.get('idDesig') as FormArray;
    this.desigs.removeAt(index);
    this.desigDataSrc.data.splice(index, 1);
    this.desigDataSrc._updateChangeSubscription();
  }

  deleteBiometric(index) {
    this.biometricInf = this.identityForm.get('biometricInf') as FormArray;
    this.biometricInf.removeAt(index);
    this.bioMDataSrc.data.splice(index, 1);
    this.bioMDataSrc._updateChangeSubscription();
  }

  deleteNameOrg(index) {
    this.concatedOrgName = '';
    this.nameOrgSpt = this.identityForm.get('nameOrgSpt') as FormArray;
    this.nameOrgSpt.removeAt(index);
    this.nameOrgScptDataSrc.data.splice(index, 1);
    const nameValues = this.nameOrgScptDataSrc.data;
    const concatedOrgNameArr = nameValues.sort(
      (a, b) => a['order'] - b['order']
    );
    for (let i = 0; i < concatedOrgNameArr.length; i++) {
      this.concatedOrgName += ' ' + concatedOrgNameArr[i]['name'];
    }
    this.fullNameOrgFlag = this.nameOrgSpt.value ? this.readAllNameTypeUsed(this.nameOrgSpt.value).includes('FULL_NAME') : false;
    this.nameOrgScptDataSrc._updateChangeSubscription();
  }

  deleteName(index) {
    this.concatedName = '';
    this.names = this.identityForm.get('names') as FormArray;
    this.names.removeAt(index);
    this.namesDataSrc.data.splice(index, 1);
    const nameValues = this.namesDataSrc.data;
    const concatedNameArr = nameValues.sort((a, b) => a['order'] - b['order']);
    for (let i = 0; i < concatedNameArr.length; i++) {
      this.concatedName += ' ' + concatedNameArr[i]['name'];
    }
    this.fullNameFlag = this.names.value ? this.readAllNameTypeUsed(this.names.value).includes('FULL_NAME') : false;
    this.namesDataSrc._updateChangeSubscription();
  }

  deleteRowDialog(index, tableName, txt): void {
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Delete', deleteTxt: txt, lang: this.lang, translations: this.translations },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        if (tableName === 'name_org') {
          this.deleteNameOrg(index);
        } else if (tableName === 'date_birth') {
          this.deleteDob(index);
        } else if (tableName === 'place_birth') {
          this.deletePob(index);
        } else if (tableName === 'address') {
          this.deleteAddress(index);
        } else if (tableName === 'doc') {
          this.deleteDoc(index);
        } else if (tableName === 'feature') {
          this.deleteFeature(index);
        } else if (tableName === 'nation') {
          this.deleteNation(index);
        } else if (tableName === 'design') {
          this.deleteDesign(index);
        } else if (tableName === 'biometric') {
          this.deleteBiometric(index);
        } else if (tableName === 'name') {
          this.deleteName(index);
        }

        this.cd.detectChanges();
      }
    });
  }

  editDobDialogRef: MatDialogRef<AddDobDialogComponent>;
  editDobDialog(row, index, isReadOnly, isFreeTextEditable): void {
    // take a closer look at isReadyOnly here
    let dobDteTyp1 = 'Range';
    if (row['dobType'] == 'Specific') {
      dobDteTyp1 = 'Specific';
    }
    const dobDialogRef = this.dialog.open(AddDobDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit date of birth',
        dobNote: row['dobNote'],
        dobType: dobDteTyp1,
        editDobSubset: row['dobSubset'],
        dobBirthDte: row['dobDate'],
        editDobFrom: row['dobFrom'],
        editDobTo: row['dobTo'],
        editRowIndex: index,
        isReadOnly: this.isReadOnly,
        editDobSubsetTyp: row['dobSubsetType'],
        isFreeTextEditable: this.isFreeTextEditable,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dobDialogRef
      .afterClosed()
      .pipe(
        filter(function (dobDatum) {
          return dobDatum;
        })
      )
      .subscribe((dobDatum: DobDialogData) => this.editDob(dobDatum));
  }

  editDob(editedDobForm): void {
    this.dobs = this.identityForm.get('dobs') as FormArray;
    let subsetDte = null;
    let specDte = null;
    let fromDte = null;
    let toDte = null;
    if (editedDobForm.dobType == 'Range') {
      if (
        editedDobForm.dobSubsetType != null &&
        editedDobForm.dobSubsetType == 'yyyy' &&
        editedDobForm.dobSubset != 'fRange'
      ) {
        let yr = null;
        if (editedDobForm.dobSubsetDte._isAMomentObject) {
          yr = editedDobForm.dobSubsetDte._i.year;
        } else {
          yr = editedDobForm.dobSubsetDte.getFullYear();
        }
        subsetDte = '' + yr;
      } else if (
        editedDobForm.dobSubsetType != null &&
        editedDobForm.dobSubsetType == 'mmyyyy' &&
        editedDobForm.dobSubset != 'fRange'
      ) {
        let yr = null;
        let month = null;
        if (editedDobForm.dobSubsetDte._isAMomentObject) {
          yr = editedDobForm.dobSubsetDte._i.year;
          month = editedDobForm.dobSubsetDte._i.month;
        } else {
          yr = editedDobForm.dobSubsetDte.getFullYear();
          month = editedDobForm.dobSubsetDte.getMonth();
        }
        month++;
        let mnth = '';
        if (month < 10) {
          mnth = '0' + month;
        } else {
          mnth = '' + month;
        }
        subsetDte = mnth + '/' + yr;
      } else if (editedDobForm.dobSubset == 'fRange') {
        if (editedDobForm.dobFrom._i) {
          fromDte =
            editedDobForm.dobFrom._i.year +
            '/' +
            editedDobForm.dobFrom._i.month +
            '/' +
            editedDobForm.dobFrom._i.date;
          toDte =
            editedDobForm.dobTo._i.year +
            '/' +
            editedDobForm.dobTo._i.month +
            '/' +
            editedDobForm.dobTo._i.date;
        } else {
          fromDte =
            editedDobForm.dobFrom.getFullYear() +
            '/' +
            editedDobForm.dobFrom.getMonth() +
            '/' +
            editedDobForm.dobFrom.getDate();
          toDte =
            editedDobForm.dobTo.getFullYear() +
            '/' +
            editedDobForm.dobTo.getMonth() +
            '/' +
            editedDobForm.dobTo.getDate();
        }
        subsetDte = 'From ' + fromDte + ' to ' + toDte;
      }
    } else {
      let yr = null;
      let month = null;
      let day = null;
      if (editedDobForm.dobSpecDte._isAMomentObject) {
        yr = editedDobForm.dobSpecDte._i.year;
        month = editedDobForm.dobSpecDte._i.month;
        day = editedDobForm.dobSpecDte._i.date;
      } else {
        yr = editedDobForm.dobSpecDte.getFullYear();
        month = editedDobForm.dobSpecDte.getMonth();
        day = editedDobForm.dobSpecDte.getDate();
      }
      month++;
      let mnth = '';
      if (month < 10) {
        mnth = '0' + month;
      } else {
        mnth = '' + month;
      }
      specDte = '' + yr + '/' + mnth + '/' + day;
    }
    this.dobs[editedDobForm.editRowIndex] = {
      dobNote: editedDobForm.dobNote,
      dobSpecDte: specDte,
      dobSubset: editedDobForm.dobSubset,
      dobTo: editedDobForm.dobTo,
      dobFrom: editedDobForm.dobFrom,
      dobSubsetType: editedDobForm.dobSubsetType,
      dobSubsetDte: subsetDte,
      dobType: editedDobForm.dobType,
    };
    const editDobCtrl = this.identityForm.get([
      'dobs',
      editedDobForm.editRowIndex,
    ]) as FormControl;
    editDobCtrl.patchValue(this.dobs[editedDobForm.editRowIndex]);

    const datax = this.dobsDataSrc.data;
    const dobDate = editedDobForm.dobType === 'Range' ? subsetDte : specDte;
    datax[editedDobForm.editRowIndex] = {
      dobNote: editedDobForm.dobNote,
      dobDate: dobDate,
      dobSubset: editedDobForm.dobSubset,
      dobTo: editedDobForm.dobTo,
      dobFrom: editedDobForm.dobFrom,
      dobSubsetType: editedDobForm.dobSubsetType,
      dobType: editedDobForm.dobType,
    };
    this.dobsDataSrc.data = datax;
    this.cd.detectChanges();
  }

  rowClickedDoc(row: any, index: number, isReadOnly, isFreeTextEditable): void {
    this.editDocDialog(row, index, isReadOnly, isFreeTextEditable);
  }
  rowClickedDocDelete(
    row: any,
    index: number,
    isReadOnly,
    isFreeTextEditable
  ): void {
    this.deleteRowDialog(index, 'doc', 'Delete document');
  }

  editDocDialogRef: MatDialogRef<AddDocumentDialogComponent>;
  editDocDialog(row, index, isReadOnly, isFreeTextEditable): void {
    const docDialogRef = this.dialog.open(AddDocumentDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit document',
        editRowIndex: index,
        editDocNum: row['docNum'],
        editDocType: row['docType'],
        editDocTyp1: row['docTyp1'],
        editIssueDte: row['issueDte'],
        editExpDte: row['expDte'],
        editIssuingCntry: row['issuingCntry'],
        editIssuedCntry: row['issuedCntry'],
        editIssuingCity: row['issuingCity'],
        editNote: row['note'],
        docType: this.lookupLst$.docType1.filter((item) => (Object.keys(item)[0] == this.lang.toUpperCase()))[0][this.lang.toUpperCase()],
        country: this.lookupLst$.un_country_list['record'],
        isReadOnly: this.isReadOnly,
        isFreeTextEditable: isFreeTextEditable,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
        issuingCntry: this.lookupLst$.un_country_list['record'],
        issuedCntry: this.lookupLst$.un_country_list['record'],
      },
      hasBackdrop: true,
    });

    docDialogRef.afterClosed().subscribe((result: docDialogData) => {
      if (result != null || result !== undefined) {
        this.editDoc(result);
      }
    });
  }

  editDoc(editedDocForm): void {
    this.docs = this.identityForm.get('docs') as FormArray;
    this.docs[editedDocForm.editRowIndex] = {
      docNum: editedDocForm.docNum,
      docType: editedDocForm.docType,
      docTyp1: editedDocForm.docTyp1,
      issueDte: editedDocForm.issueDte,
      expDte: editedDocForm.expDte,
      issuingCntry: editedDocForm.issuingCntry,
      issuedCntry: editedDocForm.issuedCntry,
      issuingCity: editedDocForm.issuingCity,
      note: editedDocForm.note,
    };
    const editDocCtrl = this.identityForm.get([
      'docs',
      editedDocForm.editRowIndex,
    ]) as FormControl;
    editDocCtrl.patchValue(this.docs[editedDocForm.editRowIndex]);
    const datax = this.docDataSrc.data;
    datax[editedDocForm.editRowIndex] = {
      docNum: editedDocForm.docNum,
      docType: editedDocForm.docType,
      docTyp1: editedDocForm.docTyp1,
      issueDte: editedDocForm.issueDte,
      expDte: editedDocForm.expDte,
      issuingCntry: editedDocForm.issuingCntry,
      issuedCntry: editedDocForm.issuedCntry,
      issuingCity: editedDocForm.issuingCity,
      note: editedDocForm.note,
    };
    this.docDataSrc.data = datax;
    this.cd.detectChanges();
  }

  rowClickedAddr(row, index, isReadOnly, isFreeTextEditable) {
    this.editAddrDialog(row, index, isReadOnly, isFreeTextEditable);
  }
  rowClickedAddrDelete(row, index, isReadOnly, isFreeTextEditable) {
    this.deleteRowDialog(index, 'address', 'Address');
  }

  editAddrDialogRef: MatDialogRef<AddAddressDialogComponent>;
  editAddrDialog(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ): void {
    // take a closer look aisReadOnly here
    const dialogRef = this.dialog.open(AddAddressDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit Address',
        country: this.getMembrState(),
        editRowIndex: index,
        editStreet: row['street'],
        editCity: row['city'],
        editStateProv: row['stateProv'],
        editCountry: row['country'],
        editZipCde: row['zipCde'],
        editRegion: row['region'],
        editNote: row['note'],
        editLat: row['lat'],
        editLng: row['lng'],
        isReadOnly: this.isReadOnly,
        isFreeTextEditable: isFreeTextEditable,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(function (addrDatum) {
          return addrDatum;
        })
      )
      .subscribe((addrDatum: AddressData) => this.editAddress(addrDatum));
  }

  editAddress(editedAddrForm): void {
    this.address = this.identityForm.get('address') as FormArray;
    this.address[editedAddrForm.editRowIndex] = {
      street: editedAddrForm.street,
      city: editedAddrForm.city,
      stateProv: editedAddrForm.stateProv,
      zipCde: editedAddrForm.zipCde,
      country: editedAddrForm.country,
      note: editedAddrForm.note,
      region: editedAddrForm.region,
      lat: editedAddrForm.lat,
      lng: editedAddrForm.lng,
    };
    const editAddrCtrl = this.identityForm.get([
      'address',
      editedAddrForm.editRowIndex,
    ]) as FormControl;
    editAddrCtrl.patchValue(this.address[editedAddrForm.editRowIndex]);

    const datax = this.address[editedAddrForm.editRowIndex];
    this.addrDataSrc.data = this.address.value;
    this.addrDataSrc._updateChangeSubscription();
  }

  rowClickedPob(row, index, isReadOnly, isFreeTextEditable) {
    this.editPobDialog(row, index, isReadOnly, isFreeTextEditable);
  }
  rowClickedPobDelete(row, index, isReadOnly, isFreeTextEditable) {
    this.deleteRowDialog(index, 'place_birth', 'Delete place of birth');
  }

  editPobDialogRef: MatDialogRef<AddPobDialogComponent>;
  editPobDialog(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ): void {
    // take a closer look at isReadOnly here
    const pobDialogRef = this.dialog.open(AddPobDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit Place of birth',
        cntry: this.getMembrState(),
        editRowIndex: index,
        editStreet: row['street'],
        editCity: row['city'],
        editStateProv: row['stateProv'],
        editCountry: row['country'],
        editZipCde: row['zipCde'],
        editRegion: row['region'],
        editNote: row['note'],
        editLat: row['lat'],
        editLng: row['lng'],
        isReadOnly: this.isReadOnly,
        isFreeTextEditable: isFreeTextEditable,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    pobDialogRef
      .afterClosed()
      .pipe(
        filter(function (pobDatum) {
          return pobDatum;
        })
      )
      .subscribe((pobDatum: PobDialogData) => this.editPob(pobDatum));
  }

  editPob(editedPobForm): void {
    this.pobs = this.identityForm.get('pobs') as FormArray;
    this.pobs[editedPobForm.editRowIndex] = {
      street: editedPobForm.street,
      city: editedPobForm.city,
      stateProv: editedPobForm.stateProv,
      zipCde: editedPobForm.zipCde,
      country: editedPobForm.country,
      note: editedPobForm.note,
      region: editedPobForm.region,
      lat: editedPobForm.lat,
      lng: editedPobForm.lng,
    };
    const editPobCtrl = this.identityForm.get([
      'pobs',
      editedPobForm.editRowIndex,
    ]) as FormControl;
    editPobCtrl.patchValue(this.pobs[editedPobForm.editRowIndex]);
    const data1 = this.pobs[editedPobForm.editRowIndex];
    this.pobsDataSrc.data = [data1];
    this.cd.detectChanges();
  }

  rowClickedFeat(row: any, index: number, isReadOnly, isFreeTextEditable) {
    this.editFeatDialog(row, index, isReadOnly, isFreeTextEditable);
  }
  rowClickedFeatDelete(
    row: any,
    index: number,
    isReadOnly,
    isFreeTextEditable
  ) {
    this.deleteRowDialog(index, 'feature', 'Delete feature');
  }

  editFeatDialogRef: MatDialogRef<AddFeatureDialogComponent>;
  editFeatDialog(
    row: any,
    index: number,
    isReadOnly,
    isFreeTextEditable
  ): void {
    const featDialogRef = this.dialog.open(AddFeatureDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit feature',
        featureTypes: this.getFeatures(),
        editRowIndex: index,
        editFeatureType: row['featureType'],
        editFStatus: row['fStatus'],
        editFValue: row['fValue'],
        editFNotes: row['fNotes'],
        isReadOnly: this.isReadOnly,
        isTranslationMode: this.isTranslationMode,
        fStatus: this.getFeaturesStatus(),
        isFreeTextEditable: isFreeTextEditable,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    featDialogRef
      .afterClosed()
      .pipe(
        filter(function (featDatum) {
          return featDatum;
        })
      )
      .subscribe((featDatum: FeatureData) => this.editFeat(featDatum));
  }

  editFeat(editedFeatForm): void {
    this.features = this.identityForm.get('features') as FormArray;
    this.features[editedFeatForm.editRowIndex] = {
      featureType: editedFeatForm.featureType,
      fStatus: editedFeatForm.fStatus,
      fValue: editedFeatForm.fValue,
      fNotes: editedFeatForm.fNotes,
    };
    const editFeatCtrl = this.identityForm.get([
      'features',
      editedFeatForm.editRowIndex,
    ]) as FormControl;
    editFeatCtrl.patchValue(this.features[editedFeatForm.editRowIndex]);
    const datax = this.featDataSrc.data;
    datax[editedFeatForm.editRowIndex] = this.features[
      editedFeatForm.editRowIndex
    ];
    this.featDataSrc.data = datax;
    this.cd.detectChanges();
  }

  rowClickedBioM(row: any, index: number, isReadOnly, isFreeTextEditable) {
    this.editBiometricDialog(row, index, isReadOnly, isFreeTextEditable);
  }

  rowClickedDeleteBioM(
    row: any,
    index: number,
    isReadOnly,
    isFreeTextEditable
  ) {
    this.deleteRowDialog(index, 'biometric', 'Delete biometric information');
  }

  editBiometricDialogRef: MatDialogRef<BiometricDialogComponent>;
  editBiometricDialog(
    row: any,
    index: number,
    isReadOnly: boolean,
    isFreeTextEditable: boolean
  ) {
    // take a closer look at isReadOnly here
    this.biometricTypesUsedArr = this.readAllBiometricTypesUsed();
    const biometricDialogRef = this.dialog.open(BiometricDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Edit biometric',
        biometricTypesUsedArr: this.biometricTypesUsedArr,
        biometricTypes: this.lookupLst$.biometricType,
        // biometricTypes: this.getBiometricTypeKeys(),
        biometricObj: this.lookupLst$.biometricType,
        editRowIndex: index,
        editBioMType: row['bioMType'],
        editBioMVal: row['bioMVal'],
        editBioMNote: row['bioMNote'],
        editBioMAttch: row['bioMAttch'],
        tabId: this.tabData ? this.tabData.tabId : null,
        isReadOnly: this.isReadOnly,
        isFreeTextEditable: isFreeTextEditable,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    biometricDialogRef
      .afterClosed()
      .pipe(
        filter(function (biometricDatum) {
          if (biometricDatum) {
            return biometricDatum;
          }
        })
      )
      .subscribe((biometricDatum: BiometricDialogData) =>
        this.editBiometricInf(biometricDatum)
      );
    this.editBiometricDialogRef = biometricDialogRef;
  }

  editBiometricInf(editedBioMForm): void {
    this.biometricInf = this.identityForm.get('biometricInf') as FormArray;

    const bioMArr: FormArray = this.fb.array([]);

    if (editedBioMForm.bioMAttch && editedBioMForm.bioMAttch.length > 0) {
      editedBioMForm.bioMAttch.forEach((attach) => {
        const attachments: FormGroup = new FormGroup({
          filename: new FormControl(attach.name),
          filesize: new FormControl(attach.size),
          fileTyp: new FormControl(attach.type),
          fileId: new FormControl(attach.fileId),
        });
        bioMArr.push(attachments);
      });
    }

    let totalAttachments = editedBioMForm.bioMAttch.length;
    if (editedBioMForm.prevAttchs) {
      totalAttachments += editedBioMForm.prevAttchs.length;
    }

    // if there are new file Attachments to be uploaded
    if (editedBioMForm.bioMAttch.length > 0) {
      this.biometricInf.removeAt(editedBioMForm.editRowIndex);

      this.biometricInf.insert(
        editedBioMForm.editRowIndex,
        new FormGroup({
          bioMType: new FormControl(editedBioMForm.bioMType),
          bioMVal: new FormControl(editedBioMForm.bioMVal),
          bioMAttch: new FormControl(editedBioMForm.bioMAttch),
          bioMNote: new FormControl(editedBioMForm.bioMNote),
          bioMDeletes: new FormControl(editedBioMForm.fileIdsToBeDeleted),
          bioMPrevAttchs: new FormControl(editedBioMForm.prevAttchs),
          bioMTabId: new FormControl(editedBioMForm.tabId),
          bioMTotalAttchs: new FormControl(totalAttachments),
        })
      );
    } else {
      // no need to upload an exisitng old attachment, it is already in the database
      this.biometricInf.removeAt(editedBioMForm.editRowIndex);
      this.biometricInf.insert(
        editedBioMForm.editRowIndex,
        new FormGroup({
          bioMType: new FormControl(editedBioMForm.bioMType),
          bioMVal: new FormControl(editedBioMForm.bioMVal),
          bioMAttch: new FormControl(editedBioMForm.bioMAttch),
          bioMNote: new FormControl(editedBioMForm.bioMNote),
          bioMDeletes: new FormControl(editedBioMForm.fileIdsToBeDeleted),
          bioMPrevAttchs: new FormControl(editedBioMForm.prevAttchs),
          bioMTabId: new FormControl(editedBioMForm.tabId),
          bioMTotalAttchs: new FormControl(totalAttachments),
        })
      );
    }

    const data1 = this.biometricInf.controls[editedBioMForm.editRowIndex].value;
    const oldData = this.bioMDataSrc.data;
    oldData[editedBioMForm.editRowIndex] = data1;
    this.bioMDataSrc.data = oldData;
    this.cd.detectChanges();
  }

  nationalityRowClicked(row, i, isReadOnly) {
    this.editNationltyDialog(row, i, isReadOnly);
  }
  nationalityRowClickedDelete(row, i, isReadOnly) {
    this.deleteRowDialog(i, 'nation', 'Delete nationality');
  }

  nationalityDialogRef: MatDialogRef<NationalityDialogComponent>;
  openNationalityDialog() {
    if (!this.isReadOnly) {
      this.nationaltty = this.identityForm.get('nationalttY') as FormArray;
      const alreadyChosenArr = [];
      const result = this.nationaltty.controls.map((ctrl) => {
        alreadyChosenArr.push(ctrl.value ? ctrl.value['nation'] : '');
      });

      const nationalityDialogRef = this.dialog.open(NationalityDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add nationality',
          cntry: this.mbrStates,
          alreadyChosen: alreadyChosenArr,
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      nationalityDialogRef
        .afterClosed()
        .pipe(
          filter(function (nationalttyDatum) {
            return nationalttyDatum;
          })
        )
        .subscribe((nationalttyDatum: string) =>
          this.addNationality(nationalttyDatum)
        );
      this.nationalityDialogRef = nationalityDialogRef;
    }
  }

  editNationltyDialogRef: MatDialogRef<NationalityDialogComponent>;
  editNationltyDialog(row: any, index: number, isReadOnly: boolean) {
    // take a closer look at isReadOnly here
    // get the value being edited, after it is changed or removed, we need to splice it out of the alreadyChosen array
    this.nationaltty = this.identityForm.get('nationalttY') as FormArray;
    const alreadyChosenArr = [];
    this.nationaltty.controls.map((ctrl) => {
      alreadyChosenArr.push(ctrl.value ? ctrl.value['nation'] : '');
    });

    const editNationltyDialogRef = this.dialog.open(
      NationalityDialogComponent,
      {
        width: this.DIALOG_SM,
        data: {
          title: 'Edit nationality',
          editRow: row,
          cntry: this.mbrStates,
          editRowIndex: index,
          isReadOnly: this.isReadOnly,
          isTranslationMode: this.isTranslationMode,
          alreadyChosen: alreadyChosenArr,
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      }
    );

    editNationltyDialogRef
      .afterClosed()
      .pipe(
        filter(function (nationalityDatum) {
          return nationalityDatum;
        })
      )
      .subscribe((nationalityDatum: string) =>
        this.editNationality(nationalityDatum, index, alreadyChosenArr)
      );
    this.editNationltyDialogRef = editNationltyDialogRef;
  }

  editNationality(
    nationalityDatum: any,
    index: number,
    alreadyChosenArr
  ): void {
    this.nationaltty = this.identityForm.get('nationalttY') as FormArray;
    this.nationaltty.removeAt(index);
    this.nationaltty.push(this.fb.group(nationalityDatum));
    const result = this.nationaltty.controls.map((ctrl) => {
      alreadyChosenArr.push(ctrl.value['nation']);
    });

    const data1 = this.nationaltyDataSrc.data;
    data1[index] = nationalityDatum;
    this.nationaltyDataSrc.data = data1;
    this.cd.detectChanges();
  }

  // Title
  titleDialogRef: MatDialogRef<TitleDialogComponent>;
  openTitleDialog() {
    if (!this.isReadOnly) {
      const titleDialogRef = this.dialog.open(TitleDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add title',
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      titleDialogRef
        .afterClosed()
        .pipe(
          filter(function (datum) {
            return datum;
          })
        )
        .subscribe((datum: string) => this.addTitles(datum));
      this.titleDialogRef = titleDialogRef;
    }
  }

  titleRowClicked(row, i, isReadOnly) {
    this.editTitleDialog(row, i, isReadOnly);
  }

  titleRowClickedDelete(row, i, isReadOnly) {
    this.deleteRowDialog(i, 'title', 'Delete title');
  }

  editTitleDialogRef: MatDialogRef<TitleDialogComponent>;
  editTitleDialog(row: any, index: number, isReadOnly: boolean) {
    // take a closer look at isReadOnly here
    const editTitleDialogRef = this.dialog.open(TitleDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit title',
        editRowIndex: index,
        editTitle: row['title'],
        isReadOnly: this.isReadOnly,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    editTitleDialogRef
      .afterClosed()
      .pipe(
        filter(function (datum) {
          return datum;
        })
      )
      .subscribe((datum: string) => this.editTitleInfo(datum, index));
    this.editTitleDialogRef = editTitleDialogRef;
  }

  editTitleInfo(datum: any, index: number): void {
    const editTitleCtrl = this.identityForm.get([
      'idTitle',
      index,
    ]) as FormControl;
    editTitleCtrl.patchValue(datum['title']);
    const data1 = this.titleDataSrc.data;
    data1[index] = datum;
    this.titleDataSrc.data = data1;
    this.cd.detectChanges();
  }

  // Designation
  desigDialogRef: MatDialogRef<DesigDialogComponent>;
  openDesigDialog() {
    if (!this.isReadOnly) {
      const desigDialogRef = this.dialog.open(DesigDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Add designation',
          lang: this.lang,
          translations: this.translations,
        },
        hasBackdrop: true,
      });

      desigDialogRef
        .afterClosed()
        .pipe(
          filter(function (desigDatum) {
            return desigDatum;
          })
        )
        .subscribe((desigDatum: string) => this.addDesigs(desigDatum));
      this.desigDialogRef = desigDialogRef;
    }
  }

  desigRowClicked(row, i, isReadOnly) {
    this.editDesigDialog(row, i, isReadOnly);
  }

  desigRowClickedDelete(row, i, isReadOnly) {
    this.deleteRowDialog(i, 'design', 'Delete designation');
  }

  editDesigDialogRef: MatDialogRef<DesigDialogComponent>;
  editDesigDialog(row: any, index: number, isReadOnly: boolean) {
    // take a closer look at isReadOnly here
    const editDesigDialogRef = this.dialog.open(DesigDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit designation',
        editRowIndex: index,
        editDesig: row['designation'],
        isReadOnly: this.isReadOnly,
        isTranslationMode: this.isTranslationMode,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    editDesigDialogRef
      .afterClosed()
      .pipe(
        filter(function (desigDatum) {
          return desigDatum;
        })
      )
      .subscribe((desigDatum: string) => this.editDesigInfo(desigDatum, index));
    this.editDesigDialogRef = editDesigDialogRef;
  }

  editDesigInfo(desigDatum: any, index: number): void {
    const editDesigCtrl = this.identityForm.get([
      'idDesig',
      index,
    ]) as FormControl;
    editDesigCtrl.patchValue(desigDatum['designation']);

    const data = this.desigDataSrc.data;
    data[index] = desigDatum;
    this.desigDataSrc.data = data;
    this.cd.detectChanges();
  }

  downloadBiometricAttachment(attachNums, row, index) {
    const filename = 'unsol_biometric.zip';
    const fileIdArr = attachNums.map((attch) => {
      return attch.fileId;
    });
    this.sancLoadSvc.downloadBiomAttchmnts(fileIdArr).subscribe(
      (data) => {
        const blob = new Blob([data], {
          type: 'application/zip',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      (err) => {
        alert('Problem while downloading zip file.');
        console.error(err);
      }
    );
  }

  getTranslation(str) {
    return this.translations[this.lang.toLocaleLowerCase()][str] || str;
  }

  isNameAddable() {
    const entryType = this.lookupLst$['entryType'].filter((item) => item['EN']['entryTypeName'] === 'Individual')[0]
    const fullNameRecord = this.identityForm.get('names').value.find(item => item.nameType === 'FULL_NAME');
    if (entryType['EN'].entryTypeName === 'Individual') {
      return !fullNameRecord;
    } else {
      return this.identityForm.get('names').value.length === 0;
    }
  }
}

export interface DialogData {
  nameType: {};
  name: string;
  title: string;
  order: number;
  script: {};
  ordNumUsedArr: number[];
  editNameType: {};
  editName: string;
  editOrder: number;
  editScript: {};
  editRowIndex: number;
  lang: string;
  translations: {};
}

export interface BiometricDialogData {
  biometricTypes: {};
  title: string;
  bioMType: string;
  bioMVal: string;
  bioMAttch: [{}];
  bioMNote: string;
  editRowIndex: number;
  editBiometricTypes: {};
  editTitle: string;
  editBioMType: string;
  editBioMVal: string;
  editBioMAttch: [{}];
  editBioMNote: string;
  lang: string;
  translations: {};
}

export interface DobDialogData {
  dobSpecDte: string;
  dobSubset: string;
  dobSubsetDte: string;
  dobSubsetType: string;
  dobTo: string;
  dobFrom: string;
  dobNote: string;
  dobType: string;
  editDobSpecDte: string;
  editDobSubset: string;
  editDobSubsetDte: string;
  editDobSubsetType: string;
  editDobTo: string;
  editDobFrom: string;
  editDobNote: string;
  editRowIndex: number;
  dobDteTyp: string;
  lang: string;
  translations: {};
}

export interface docDialogData {
  docNum: string;
  docType: string;
  docTyp1: string;
  issueDte: string;
  expDte: string;
  issuingCntry: string;
  issuedCntry: string;
  issuingCity: string;
  note: string;
  editRowIndex: number;
  editDocNum: string;
  editDocType: string;
  editDocTyp1: string;
  editIssueDte: string;
  editExpDte: string;
  editIssuingCntry: string;
  editIssuedCntry: string;
  editIssuingCity: string;
  editNote: string;
  lang: string;
  translations: {};
}

export interface PobDialogData {
  street: string;
  city: string;
  title: string;
  stateProv: string;
  zipCde: string;
  country: string;
  locOptions: string;
  note: string;
  region: string;
  lat: number;
  lng: number;
  editRowIndex: number;
  editStreet: string;
  editCity: string;
  editTitle: string;
  editStateProv: string;
  editZipCde: string;
  editCountry: string;
  editLocOptions: string;
  editNote: string;
  editRegion: string;
  editLat: number;
  editLng: number;
  lang: string;
  translations: {};
}
