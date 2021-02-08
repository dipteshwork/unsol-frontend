import { ActivatedRoute } from '@angular/router';
import { AdalService } from 'adal-angular4';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnDestroy,
  NgZone,
  Input,
} from '@angular/core';
import {
  debounceTime,
  switchMap,
  tap,
  finalize,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MatTabGroup,
  MatTabHeader,
  MatTab,
  MatTableDataSource,
} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import * as moment from 'moment';
import _ from 'lodash';

import { OnExtHoldDialogComponent } from '../dialog/entry/on-ext-hold-dialog/on-ext-hold-dialog.component';
import { OnHoldDialogComponent } from '../dialog/entry/on-hold-dialog/on-hold-dialog.component';
import { ActivateDialogComponent } from '../dialog/action/activate-dialog/activate-dialog.component';
import { PublishDialogComponent } from '../dialog/action/publish-dialog/publish-dialog.component';
import { ReviewDialogComponent } from '../dialog/action/review-dialog/review-dialog.component';
import { Submitted4ReviewDialogComponent } from '../dialog/action/submitted4-review-dialog/submitted4-review-dialog.component';
import { IdentityComponent } from '../identity/identity.component';
import { StatusRemovedDialogComponent } from '../dialog/action/status-removed-dialog/status-removed-dialog.component';
import { StatusDelistedDialogComponent } from '../dialog/action/status-delisted-dialog/status-delisted-dialog.component';
import { PressReleaseDialogComponent } from '../dialog/listingReq/press-release-dialog/press-release-dialog.component';
import { LookupLst } from '../../classes/lookupLst';
import { SanctionInputService } from '../../services/sanction-input.service';
import {
  Identity,
  SanctionMetaData,
  SanctionInputEntry,
  ActivityLog,
} from '../../classes/sanction-input-class';
import { SanctionLoadService } from '../../services/sanction-load.service';
import { LookupCollproviderProvider } from '../../services/providers/lookup-collprovider.service';
import { RemoveDialogComponent } from '../dialog/action/remove-dialog/remove-dialog.component';
import { SubmittedByDialogComponent } from '../dialog/entry/submitted-by-dialog/submitted-by-dialog.component';
import { WorkflowVersionsComponent } from 'src/app/components/dialog/entry/workflow-versions/workflow-versions.component';
import Docxgen from '../../../assets/b4/js/docxtemplater';
import JSZipUtils from '../../../assets/b4/js/jszip-utils';
import { saveAs } from '../../../assets/b4/js/file-saver.min';
import { environment } from '../../../environments/environment';
import { AzureAuthGuardService } from '../../services/azure-auth-guard.service';
import { NotificationService } from '../../services/alert/notification.service';
import { WarningDialogComponent } from '../dialog/entry/warning-dialog/warning-dialog.component';
import { AuthService } from '../../services/auth.service';
import { AmendDialogComponent } from '../dialog/action/amend-dialog/amend-dialog.component';
import { PressReleaseintf } from '../../models/sanctionintf';
import { Regime } from '../../models/regimesModel';

const fakeUser = environment.fakeUser;

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewUserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('idTabs') idTabs: MatTabGroup;
  @ViewChild('idTb') idTb: any;
  @ViewChildren(IdentityComponent) idCmpChildren: QueryList<IdentityComponent>;

  @Input('lkupSrv') lookupLst$: LookupLst;

  private _routerSub = Subscription.EMPTY;

  isSanctionDetailsCall = false;
  isSubmitReviewConfirmedMp = new Map<string, {}>();
  areAllSubmitReviewConfirmed = false;
  downloadOfflineTranslation;
  submitReviewConfirmed = false;
  DIALOG_LG = '80%';
  DIALOG_SM = window.screen.width > 768 ? '30%' : '80%';
  DIALOG_MD = window.screen.width > 768 ? '60%' : '80%';
  testpressR = [];
  mbrState;
  entryStatuses;
  regimes;
  selectedTab = new FormControl(0);
  ngxsSanctStatus = null;
  unsavedChanges = false;
  sanctionForm: FormGroup;
  sanctionDta: any = {};
  allAmendmentInfo: any = {};
  sanctionId: string = null;
  primaryName: string = null;
  refNum: string = null;
  amendmentId: string = null;

  lang = 'EN';
  lowLang = 'en';
  langArr: string[];
  workingMainLanguage = 'EN';
  nonOfficialLangArr: string[];
  nonOfficialLangObjects: any;
  translations: {};
  isTranslated = false;
  translationStatus: boolean[];

  amendmentCt = 0;
  amendmentStatus = '';
  queryStatus = '';
  supersededCt = 0;
  pendingData = null;
  navigationSubscription;
  result: string;
  submittdByArr: FormArray = new FormArray([]);
  newEntry: FormArray = new FormArray([]);
  names: FormArray = new FormArray([]);
  nameOrgSpt: FormArray = new FormArray([]);
  presRelesee: FormArray;
  activityLogs = [];
  narrWebsteUpdteDte: FormArray;
  isReady = false;
  searchRelatedLstResult = [];
  errIdentityChildForm = [];
  srchRelatedLstArr: FormArray = new FormArray([]);
  tabs = [];
  mode = 'readOnly';
  isReadOnly = true;
  selected = new FormControl(0);
  regimeRow = new FormArray([]);
  regimeMeas = [];
  previouslyChekApplicableMeasures = [];
  idIndex: number;
  currTabIndx = 0;
  isActivityLgEmpty = false;
  recordType = 'Individual';
  isEditMode = false;
  isCreateMode = false;
  isTranslationMode = false;
  isAmendment = false;
  isRemoveWrkFlwLinks = false;
  isFreeTextEditable = false;
  submittedByDataSrc = new MatTableDataSource();
  isApplicableMeasuresValid = false;
  regime = '';
  interpolNum = '';
  mbmrStConfid = false;
  measureArr = [];
  relatedListSearchRes = [];
  submittedBycountryNamesDisplayedCols: any[] = [
    { property: 'countryName', name: 'Country' },
  ];
  submittedBycountryNamesDisplayedColsArr: string[] = this.submittedBycountryNamesDisplayedCols.map(
    (x) => x.property
  );
  canBePublished = false;
  isLoading = false;
  appLang = 'EN';
  workingLanguage: string;
  isEditableLiviginStatusAndGender: boolean = false;

  addActivateDialogRef: MatDialogRef<ActivateDialogComponent>;
  warningDialogRef: MatDialogRef<WarningDialogComponent>;
  addReviewDialogRef: MatDialogRef<ReviewDialogComponent>;
  prevSanctionData: any;
  prevIdentityData: any;

  constructor(
    private activeRouter: ActivatedRoute,
    private sancLoadSrv: SanctionLoadService,
    private router: Router,
    private fb: FormBuilder,
    private sancinputSvc: SanctionInputService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private notifyService: NotificationService,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService,
    public adalService: AdalService,
    public zone: NgZone,
    public azureAuthService: AzureAuthGuardService,
  ) {
    this._routerSub = this.router.events.subscribe(
      (e: any) => {
        if (e instanceof NavigationStart) {
        }
        if (e instanceof NavigationEnd) {
          if (this.router.navigated && this.isSanctionDetailsCall) {
            this.initialiseInvites();
            this.isSanctionDetailsCall = false;
          }
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  ngOnInit() {
    this.appLang = this.authServ.getPreferLang().toUpperCase();
    const currentURL = this.activeRouter.snapshot.url.join('/');
    if (
      currentURL.includes('status/PENDING/isStatusCurrent/false') ||
      currentURL.includes('status/SUBMIT4REVIEW/isStatusCurrent/false') ||
      currentURL.includes('superseded')
    ) {
      this.isRemoveWrkFlwLinks = true;
    }

    this.activeRouter.paramMap.subscribe(
      (params) => {
        // check if it is for new entry or for already existing one
        if (params.get('entryType')) {
          this.isEditMode = true;
          this.isCreateMode = true;
        } else {
          this.isEditMode = false;
          this.isCreateMode = false;
        }

        this.refNum = params.get('refNum');
        this.sanctionId = params.get('id');
        this.queryStatus = params.get('status');
        this.ngxsSanctStatus = this.queryStatus;
        this.workingMainLanguage =
          params.get('language') ||
          params.get('lang') ||
          this.workingMainLanguage;

        this.lang = params.get('language') || this.workingMainLanguage;
        this.lowLang = this.lang.toLowerCase();

        this.amendmentId = params.get('amendmentId');

        if (params.get('amendmentCt')) {
          this.amendmentCt = parseInt(params.get('amendmentCt'), 10);
        }
        if (params.get('supersededCt')) {
          this.supersededCt = parseInt(params.get('supersededCt'), 10);
        }
        if (params.get('amendmentStatus')) {
          this.amendmentStatus = params.get('amendmentStatus');
          this.isAmendment = true;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );

    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.workingLanguage = this.lookupLst$.language.find((item) => item.isWorking) ?
      this.lookupLst$.language.find((item) => item.isWorking).acronym : 'EN';
    this.mbrState = this.getMembrState();
    this.entryStatuses = this.entryStatus();
    this.regimes = this.getRegimes();
    this.langArr = this.lookupCollprovider.getOfficialLanguages();
    this.nonOfficialLangArr = this.lookupCollprovider.getNonOfficialLanguages();
    this.nonOfficialLangObjects = this.lookupLst$.language.filter(item => !item.isOfficial);
    this.translations = this.lookupCollprovider.getTranslations();

    if (!this.lang) {
      this.lang = 'EN';
    }
    this.lowLang = this.lang.toLowerCase();

    if (this.sanctionId != null) {
      // existing sanction from DB
      this.populateFormWSanctionData(false);
    } else {
      // brand new Sanction, as no EntryID exists
      this.populateFormNewEntrydata();
    }

    this.getTranslationStatus();
    if (this.ngxsSanctStatus == 'Init' || this.ngxsSanctStatus == 'New') {
      this.isFreeTextEditable = true;
    }
    this.getStatusAmendment(this.lang)
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this._routerSub.unsubscribe();
      this.navigationSubscription.unsubscribe();
    }
  }

  loadSanctionsDetails(
    langId: string,
    refnum: string,
    idNum: number,
    sanctionData: SanctionInputEntry,
    amendmentId: string
  ) {
    const entryStatus = this.lookupCollprovider.getEntryStatus(
      'EN',
      this.queryStatus
    );

    return new Promise((resolve) => {
      this.sancLoadSrv
        .loadSanctionDetails(
          langId,
          refnum,
          idNum,
          !this.isRemoveWrkFlwLinks,
          entryStatus[this.lang],
          this.amendmentCt,
          this.amendmentStatus,
          this.supersededCt,
          amendmentId
        )
        .subscribe(
          (data) => {
            this.createActivityLog(data.activityLog as any);
            const isSubmitReviewResultArr = data['submitReviewResult'] || [];

            for (let i = 0; i < isSubmitReviewResultArr.length; i++) {
              const key = isSubmitReviewResultArr[i]['sanctionLang'];
              let val = isSubmitReviewResultArr[i]['submitReviewConfirmed'];
              if (val == undefined) {
                val = false;
              }
              this.isSubmitReviewConfirmedMp.set(key, {
                isSubmitReviewConfirmed: val,
              });
            }

            this.areAllSubmitReviewConfirmed = this.areAllLangsSubmitReviewConfirmed();
            sanctionData = data; // check for SanctionMetaData, if not there assign it
            const sanctionMetaData: SanctionMetaData = new SanctionMetaData(
              data['docUnderscoreId']
            );
            if (data['amendmentInfo']) {
              sanctionMetaData.setAmendmentInfo(data['amendmentInfo']);
            }
            if (data['supersededInfo']) {
              sanctionMetaData.setSupersededInfo(data['supersededInfo']);
            }
            if (data['ancestorsArr']) {
              sanctionMetaData.setAncestors(data['ancestorsArr']);
            }
            if (data['parent']) {
              sanctionMetaData.setParent(data['parent']);
            }
            if (data['siblingsArr']) {
              sanctionMetaData.setSiblings(data['siblingsArr']);
            }

            this.isTranslated = data['translated'];
            sanctionData.sanctionMetaData = sanctionMetaData;
            if (sanctionData.status == 'PENDING') {
              this.ngxsSanctStatus = 'PENDING';
              this.isReadOnly = true;
              this.isEditMode = false;
            }
            this.sanctionDta = sanctionData;
            resolve(sanctionData);
          },
          (error) => {
            this.notifyService.showError(error, 'Error');
          }
        );
    });
  }

  getStatusAmendment(langId){
    this.sancLoadSrv.loadSanction(langId, 'ALL').subscribe((data) => {
      if (data.length > 0) {
        this.allAmendmentInfo = data;
      }
    });
  }

  downloadTranslatedFile(template: String) {
    const idCmpChilds = this.idCmpChildren;
    const sanctionId = this.sanctionId;
    const sanctionForm = this.sanctionForm;
    let templateStr: String = null;
    if (template == 'download') {
      templateStr = 'assets/docTranslater/TranslatedTemplate.docx';
    } else {
      templateStr = 'assets/docTranslater/EntryPreviewTemplate_v1.docx';
    }
    generate();

    function generate() {
      const loadFile = function (url, callback) {
        JSZipUtils.getBinaryContent(url, callback);
      };
      const expressions = require('angular-expressions');
      const angularParser = function (tag) {
        const expr = expressions.compile(tag);
        return { get: expr };
      };

      loadFile(templateStr, function (err, content) {
        if (err) {
          throw err;
        }
        const doc = new Docxgen(content);
        doc.setOptions({ parser: angularParser });
        const errChildForm = [];
        const sanc = sanctionForm;
        const submittdByArr = sanc.controls.lstReq['controls'].submittdBy.controls;
        const submittedBy = submittdByArr.map((submitBy) => submitBy.value);
        const submitdBy = submittedBy.join();
        
        const listingData = {
          sanctionId: sanctionId,
          listName: sanc.controls.lstReq['controls'].regime.value,
          listingNote: sanc.controls.lstReq['controls'].lstngNotes.value,
          statementConfidential:
            sanc.controls.lstReq['controls'].stmntConfid.value,
          entryRemarks: sanc.controls.lstReq['controls'].entryRemarks.value,
          reasonForListing:
            sanc.controls.narrativeSumm['controls'].lstingReason.value,
          additionalInformation:
            sanc.controls.narrativeSumm['controls'].addtlInfo.value,
          relatedList: ['placeholder'],
          submittedBy: submitdBy || [],
          submittedOn: sanc.controls.lstReq['controls'].submittdOn.value,
          refNum: sanc.controls.lstReq['controls'].refNum.value,
          listedOn: sanc.controls.narrativeSumm['controls'].availDte.value,
          delistedOn: '',
        };
        const idTempLatArr = [];
        let outputNm = '';

        function createIdentityArr(oneChild) {
          const identity: Identity = oneChild.identityForm.value;
          // when a selection is disabled, we lose its value in the form
          if (
            oneChild.identityForm.controls.idType.status == 'DISABLED' &&
            oneChild.identityForm.controls.idType.value == 'PRIMARY'
          ) {
            identity.idType = 'PRIMARY';
            identity.category = 'High';
          }
          if (oneChild.identityForm.invalid) {
            errChildForm.push(oneChild.id);
          }
          
          identity.genderStatus = oneChild.identityForm.controls.genderStatus.value;

          // try to get nested dobMotes and pobMotes
          const dobNotes = identity.dobs.map((dob) => {
            const resultDob = { dobNote: dob['dobNote'] };
            return resultDob;
          });
          const pobNotes = identity.pobs.map((pob) => {
            const resultPob = {
              pobNote: pob['note'],
              pobStreet: pob['street'],
              pobCity: pob['city'],
              pobState: pob['stateProv'],
              pobZpCde: pob['zipCde'],
              pobCtry: pob['country'],
              pobLoc: pob['region'],
              pobLat: pob['lat'],
              pobLng: pob['lng'],
            };
            return resultPob;
          });
          const biometricInf = identity.biometricInf.map((bioM) => {
            const resultBio = {
              bioMType: bioM['bioMType'],
              bioMVal: bioM['bioMVal'],
              bioMNote: bioM['bioMNote'],
            };
            return resultBio;
          });

          const naame = identity.names.map((name, index) => {
            outputNm += name['name'] + '_';
            const resultNm = {
              name: name['name'],
              nameType: name['nameType'],
              order: name['order'],
              script: name['script'],
            };
            return resultNm;
          });
          //aw put nameOrgSctp onto Identity datastructure
          const naameOrgScpt = identity['nameOrgSpt'].map((name, index) => {
            const resultNm = {
              name: name['name'],
              nameType: name['nameType'],
              order: name['order'],
              script: name['script'],
            };
            return resultNm;
          });
          const desigs = identity.idDesig.map((desig) => desig);
          const desig = desigs.join();
          const docNotes = identity.docs.map((doc) => {
            const resultDoc = {
              docNote: doc['note'],
              docType: doc['docTyp1'],
              docNumb: doc['docNum'],
              docType1: doc['docType'],
              docIssuingCtry: doc['issuingCntry'],
              docIssuedCtry: doc['issuedCntry'],
              docIssuingCity: doc['issuingCity'],
            };
            return resultDoc;
          });

          const fNotes = identity.features.map((feat) => {
            const resultFeats = {
              fNote: feat['fNotes'],
              featVal: feat['fValue'],
              featType: feat['featureType'],
            };
            return resultFeats;
          });

          const tmpIdArr = {
            names: naame,
            titles: identity['idTitle'],
            namesOrgScpt: naameOrgScpt,
            designations: desig,
            gender: identity.genderStatus['gender'].genderName,
            livingStatus: identity.genderStatus['livngStat'].livingStatusName,
            nationalities: identity['nationalttY'],
            documentNotes: docNotes,
            dobNotes: dobNotes,
            pobNotes: pobNotes,
            biometricInf: biometricInf,
            addresses: identity['address'],
            featuresNotes: fNotes,
            idNotes: identity['idComment'],
            identityType: identity.idType,
          };
          idTempLatArr.push(tmpIdArr);
        }
        const identitys = { identitys: idTempLatArr };
        idCmpChilds.forEach(createIdentityArr);
        const docTmpltObk = { ...listingData, ...identitys };
        doc.setData(docTmpltObk);
        doc.render();
        const out = doc.getZip().generate({ type: 'blob' });
        let outputFileNm = listingData.sanctionId + '_' + outputNm;
        if (outputFileNm.length > 90) {
          outputFileNm =
            (listingData.sanctionId + '_' + outputNm).substr(0, 90) +
            '.docx';
        } else {
          outputFileNm =
            listingData.sanctionId + '_' + outputNm + '.docx';
        }
        saveAs(out, outputFileNm);
      });
    }
  }

  createSubmittedBy(submittedBy: string[]): FormArray {
    this.submittdByArr = new FormArray([]);
    if (submittedBy == null || submittedBy[0] == null) {
      return new FormArray([]);
    }

    for (let i = 0; i < submittedBy.length; i++) {
      const formCtrl = new FormControl(submittedBy[i]);
      this.submittdByArr.push(formCtrl);
    }
    return this.submittdByArr;
  }

  addSubmittedBy(submittedBy: string): FormArray {
    if (submittedBy == null || submittedBy[0] == null) {
      return new FormArray([new FormControl(null)]);
    }
    const formCtrl = new FormControl(submittedBy);
    this.submittdByArr.push(formCtrl);

    return this.submittdByArr;
  }

  createActivityLog(activityLg: ActivityLog[]) {
    if (activityLg == null || activityLg[0] == null) {
      this.isActivityLgEmpty = true;
      return;
    }

    this.isActivityLgEmpty = false;
    this.activityLogs = [];

    for (let i = 0; i < activityLg.length; i++) {
      let activityStr: string = null;
      const userTask = activityLg[i].userTask;
      const userEmail = activityLg[i].userEmail;
      const prevState = activityLg[i].prevState;
      const nextState = activityLg[i].nextState;
      const activityDate: Date = activityLg[i].activityDate;
      const tmpDte = new Date(activityDate);
      const activDteStr =
        tmpDte.getFullYear() +
        '/' +
        (tmpDte.getMonth() + 1) +
        '/' +
        tmpDte.getDate() +
        'T' +
        tmpDte.getHours() +
        ':' +
        tmpDte.getMinutes() +
        ':' +
        tmpDte.getSeconds() +
        'Z';
      const activityNotes = activityLg[i].activityNotes;
      const refNum = activityLg[i].refNum;
      activityStr =
        activDteStr +
        ' - ' +
        userEmail +
        ' - ' +
        'task: ' +
        userTask +
        ' - ' +
        'prevState: ' +
        prevState +
        ' - ' +
        'currState: ' +
        nextState +
        '\nnotes: ' +
        activityNotes;
      if (refNum) {
        activityStr = activityStr;
      }
      this.activityLogs.push({
        description: activityStr,
        nextState
      });
    }
  }

  trackByIndex(i) {
    return i;
  }

  createPressRelese(): FormArray {
    return new FormArray([
      new FormGroup({
        pressRelease: new FormControl(''),
        updateType: new FormControl(''),
        updatedOn: new FormControl(''),
      }),
    ]);
  }

  getPressRelese(pressReleaseArr: [{}]): FormArray {
    const pr1 = [];
    if (pressReleaseArr == null) {
      this.presRelesee = new FormArray([]);
      return this.presRelesee;
    }
    this.presRelesee = new FormArray(
      pressReleaseArr.map(function (presR) {
        const pr =
          presR['updateType'] +
          ': ' +
          presR['updatedOn'] +
          ' - ' +
          presR['pressRelease'];
        pr1.push(pr);
        return new FormGroup({
          pressRelease: new FormControl({
            value: presR['pressRelease'],
            disabled: true,
          }),
          updateType: new FormControl({
            value: presR['updateType'],
            disabled: true,
          }),
          updatedOn: new FormControl({
            value: presR['updatedOn'],
            disabled: true,
          }),
        });
      })
    );
    this.testpressR = pr1.reverse();
    return this.presRelesee;
  }

  addSrchRelatedLst(lstResult) {
    const tmp: FormGroup = new FormGroup({
      sanctionedRelLstName: new FormControl(lstResult.item['name']),
      sanctionedRelLstRefNum: new FormControl(lstResult.item['RefNum']),
    });
    (<FormArray>(
      this.sanctionForm.get('narrativeSumm').get('srchRelatedLstArr')
    )).push(tmp);
  }

  createSrchRelatedLst(relatedLstArr): FormArray {
    const relList = relatedLstArr.split(',');
    return new FormArray(
      relList.map((relatedRefNum) => {
        return new FormGroup({
          sanctionedRelLstName: new FormControl(''),
          sanctionedRelLstRefNum: new FormControl(relatedRefNum),
        });
      })
    );
  }

  createNarrUpdteOn(): FormArray {
    return new FormArray([
      new FormGroup({
        narrWbSteDte: new FormControl(''),
      }),
    ]);
  }

  addPressRelese(): void {
    this.presRelesee = this.sanctionForm
      .get('lstReq')
      .get('presRelesee') as FormArray;

    this.presRelesee.push(
      new FormGroup({
        pressRelease: new FormControl(''),
        updateType: new FormControl(null),
        updatedOn: new FormControl(''),
      })
    );
  }

  addDelistedStatus(pRelease, updteOn, updteTyp): void {
    this.presRelesee = this.sanctionForm
      .get('lstReq')
      .get('presRelesee') as FormArray;
    this.presRelesee.push(
      new FormGroup({
        pressRelease: new FormControl(pRelease),
        updateType: new FormControl(updteTyp),
        updatedOn: new FormControl(updteOn),
      })
    );
  }

  // pressReleaseUpdteTyp
  removePressRelese(index: number): void {
    this.presRelesee = this.sanctionForm
      .get('lstReq')
      .get('presRelesee') as FormArray;
    this.presRelesee.controls.splice(index, 1);
  }

  // add narrativeWebSiteUpdates
  addNarrWbsteUpdtes(): void {
    this.narrWebsteUpdteDte = this.sanctionForm
      .get('narrativeSumm')
      .get('narrWebsteUpdteDte') as FormArray;
    this.narrWebsteUpdteDte.push(
      new FormGroup({
        narrWbSteDte: new FormControl(''),
      })
    );
  }

  // remove narrativeWebSiteUpdates
  removeNarrWbsteUpdtes(index: number): void {
    this.narrWebsteUpdteDte = this.sanctionForm
      .get('narrativeSumm')
      .get('narrWebsteUpdteDte') as FormArray;
    this.narrWebsteUpdteDte.controls.splice(index, 1);
  }

  interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    const result = confirm(
      `Do you really want to leave ${tabHeader.selectedIndex + 1} for the tab ${
        tabHeader.selectedIndex + tab.position + 1
      }?`
    );
    tabHeader.selectedIndex + 1;
    tab.position + 1;
    return (
      result && MatTabGroup.prototype._handleClick.apply(this.idTabs, arguments)
    );
  }

  fillupSanctionDetails(
    sanctionData: SanctionInputEntry,
    nextStatus: string,
    pressRelease: any,
    isAmend: boolean,
    data: any,
    supersedeOthers: boolean,
  ): any {
    if (data.idArr && data.idArr[0]) {
      for (let i = 0; i < data.idArr.length; i++) {
        this.tabs.push({ tabIndex: '' + i + '', tabData: data.idArr[i] });
      }
    }

    const entryStatus = this.lookupLst$.entryStatus.find(
      (item) => item[this.lang] == data.status
    );
    this.ngxsSanctStatus = entryStatus['EN'];

    this.isReadOnly = true;
    this.submittedByDataSrc.data = this.createSubmittedByDataSrc(data);
    this.recordType = data.recType;
    this.regime = data.regime;
    this.interpolNum = data.interpolNum;
    this.mbmrStConfid = data.mbrStConfid;
    const resultArr = this.getIndexAndValue(
      this.lookupLst$.regime,
      data.lstReq.regime || data.regime
    );
    this.regimeMeas = resultArr['rmeas'] || this.regimeMeas;

    const previousStatus = data.lstReq.status || data.status;
    sanctionData = data;

    const nextEntryStatus = this.lookupLst$.entryStatus.find(
      (item) => item['EN'] == nextStatus
    );
    sanctionData.status = nextEntryStatus[this.lang];
    sanctionData['entryId'] = data.newEntry;
    const entryId = sanctionData['entryId'];
    let siblingArr = sanctionData['siblingArr'];
    if (data.amendmentId) {
      isAmend = true;
      siblingArr = {
        identifier: new Object(sanctionData['docUnderscoreId']),
        entryId: sanctionData['entryId'],
        entryStatus: previousStatus[this.lang],
        entryStatusCreateDte: sanctionData['statusModifiedDte'],
      };
      sanctionData['siblingsArr'].push(siblingArr);
    }

    let amendCt = 0;
    if (sanctionData['amendmentInfo'] != null) {
      amendCt = sanctionData['amendmentInfo'].length;
    }
    // if action is toAMEND get the amendment count and increment it; set the prevStatus to NEW, if no previous stage in workflow for amendment
    if (isAmend && nextStatus == 'SUBMIT4REVIEW') {
      amendCt = sanctionData['amendmentInfo']['amendmentCount'];
      // ancestor information as well as amendment information is already set by the previous stage of the amendment
    } else if (isAmend && nextStatus == 'ONHOLD') {
      sanctionData.status = nextEntryStatus[this.lang];
    } else if (isAmend && nextStatus == 'ACTIVE') {
      sanctionData.status = nextEntryStatus[this.lang];
    } else if (isAmend) {
      if (!sanctionData['ancestorsArr']) {
        sanctionData['ancestorsArr'] = [];
      }
      if (sanctionData['amendmentInfo']) {
        amendCt = sanctionData['amendmentInfo']['amendmentCount'];
      }
      amendCt++;

      sanctionData['ancestorsArr'].push({
        identifier: new Object(sanctionData['docUnderscoreId']),
      });
      sanctionData['parent'] = new Object(sanctionData['docUnderscoreId']);
      sanctionData['amendmentInfo'] = {
        amendmentCount: amendCt,
        amendmentDte: new Date(),
      };
      sanctionData.status = 'PENDING';
    } else if (sanctionData.status != 'PENDING') {
      siblingArr = {
        identifier: new Object(sanctionData['docUnderscoreId']),
        entryId: data.newEntry,
        entryStatus: previousStatus[this.lang],
        entryStatusCreateDte: data.statusModifiedDte,
      };
      // should probably put the entryId here as well
      sanctionData['siblingsArr'].push(siblingArr);
    }

    if (pressRelease) {
      // this happens upon publishing, when nextStatus is ACTIVE
      sanctionData['updatedArr'] = [pressRelease];
      sanctionData.lstReq['refNum'] = pressRelease['refNum'];
      sanctionData.refNum = pressRelease['refNum'];
    }
    // watch for incremening sanctionID, missting metatdata
    this.sancinputSvc.insertSanctionForm(sanctionData).subscribe(
      (data) => {
        this.isLoading = false;
        // check that at least a single name NOT empty string is there before attempting to save.  Else it is an error
        let amendmentId = null;
        let refNum = null;
        let result = data['data'];
        if (!result) {
          result = data;
        }

        if (isAmend) {
          amendmentId = result['scSanctionEntry'].amendmentId;
          refNum =
            result['scSanctionEntry'].entry.listings.unListType[0]
              .referenceNumber;
        }
        if (nextStatus == 'ACTIVE') {
          if (isAmend && supersedeOthers) {
            // supersede other amendments if confirmed
            this.sancinputSvc.supersedeSiblings(refNum).subscribe(
              (data) => {
                this.router.navigateByUrl('/active-entries');
              }
            );
          } else {
            this.router.navigateByUrl('/active-entries');
          }
        } else if (isAmend == true && nextStatus == 'SUBMIT4REVIEW') {
          // send back to active page,but remember to disable buttons
          this.router.navigateByUrl(
            `/user/${entryId}/null/${refNum}/${nextStatus}/${amendmentId}`
          );
        } else if (isAmend == true) {
          // send back to active page -- but remember to disable buttons
          this.router.navigateByUrl(
            `/user/${entryId}/amendment/${amendCt}/amendmentStatus/PENDING`
          );
        } else if (nextStatus == 'SUBMIT4REVIEW') {
          this.router.navigateByUrl('/submitted-entries');
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  populateFormWSanctionData(isAmend: boolean) {
    return new Promise(resolve => {
      let sanctionData: SanctionInputEntry = null;
      this.tabs = [];
      const tmp = this.tabs;

      if (!this.lang) {
        // current lang for entry form
        this.lang = this.router.url.substr(-2);
        // this.lang = this.router.url.substr(-2) || this.appLang;
        this.lowLang = this.lang.toLowerCase();
      }

      this.loadSanctionsDetails(
        this.lang,
        null,
        parseInt(this.sanctionId, 10),
        sanctionData,
        this.amendmentId
      ).then((data: any) => {
        if (data.idArr && data.idArr[0]) {
          for (let i = 0; i < data.idArr.length; i++) {
            tmp.push({ tabIndex: '' + i + '', tabData: data.idArr[i] });
          }
        }
        this.workingMainLanguage = data.workingMainLanguage;

        let disableFormField = true;
        const isFreeTxtMarratveReadOnly = true;
        const disableFreeTxtField: boolean =
          isFreeTxtMarratveReadOnly && disableFormField;
        this.submittedByDataSrc.data = this.createSubmittedByDataSrc(data);
        console.log(this.submittedByDataSrc.data)
        this.recordType = data.recType;
        this.regime = data.regime;
        this.interpolNum = data.interpolNum;
        this.mbmrStConfid = data.mbrStConfid;
        this.refNum = data.refNum;

        // get index of the current regime in regime list
        const regimeIndex = this.lookupLst$.regime.findIndex((item, index) => {
          const key = Object.keys(item[this.lang]).find(
            (key) => key !== 'isActive' && key !== 'measures'
          );
          return item[this.lang][key] === data.regime;
        });

        const regime = `${regimeIndex}--${data.regime}`;
        const regimeMeasures =
          regimeIndex >= 0 &&
          this.lookupLst$.regime[regimeIndex][this.lang].measures;

        const measuresArr = this.lookupLst$.measures;
        const filterdMeasureNames = measuresArr.filter(measure => !measure[this.lang].isActive).map(measure => measure[this.lang].measureNm);
        const filteredMeasures = regimeMeasures.filter(regimeMeasure => !filterdMeasureNames.includes(regimeMeasure));

        const checkboxes = this.getApplicableMeasures(
          filteredMeasures,
          data.measureArr
        );

        this.regimeMeas = filteredMeasures;

        const lstReq = data.lstReq || {
          status: null,
          language: null,
          refNum: null,
          interpolNum: null,
          mbmrStConfid: null,
          submittdBy: null,
          lstngNotes: null,
          statementConfid: null,
          lstRmrks: null,
          removedStatusDte: null,
          removedStatusReason: null,
        };

        const entryTypeArrByLang = this.lookupLst$.entryType.map(
          (item) => item[this.lang]
        );
        const entryType = this.lookupLst$.entryType.filter(
          (item) => item['EN'] == data.recType
        );
        const entryStatus = this.lookupLst$.entryStatus.find(
          (item) => item['EN'] == data.status
        );

        const lstReqForm = new FormGroup({
          recordTyp: new FormControl({
            value: data.recType,
            disabled: disableFormField,
          }),
          // recordTyp: new FormControl({ value: entryType[0][this.lang], disabled: disableFormField }),
          status: new FormControl({
            value: data.status,
            disabled: disableFormField,
          }),
          // status: new FormControl({ value: entryStatus[this.lang], disabled: disableFormField }),
          regime: new FormControl({ value: regime, disabled: disableFormField }),
          language: new FormControl({
            value: lstReq.language,
            disabled: disableFormField,
          }),
          refNum: new FormControl({
            value: lstReq.refNum,
            disabled: disableFormField,
          }),
          interpolNum: new FormControl({
            value: lstReq.interpolNum,
            disabled: disableFormField,
          }),
          mbmrStConfid: new FormControl({
            value: lstReq.mbmrStConfid,
            disabled: disableFormField,
          }),
          submittdBy: this.createSubmittedBy(lstReq.submittdBy),
          submittdOn: new FormControl({
            value: lstReq.submittdOn,
            disabled: disableFormField,
          }),
          lstngNotes: new FormControl({
            value: lstReq.lstngNotes,
            disabled: disableFreeTxtField,
          }),
          stmntConfid: new FormControl({
            value: lstReq.statementConfid,
            disabled: disableFreeTxtField,
          }),
          applicableMeasures: new FormArray(checkboxes),
          presRelesee: this.getPressRelese(data.updatedArr),
          entryRemarks: new FormControl({
            value: lstReq.lstRmrks,
            disabled: disableFreeTxtField,
          }),
          removedStatusDte: new FormControl({
            value: lstReq.removedStatusDte,
            disabled: disableFormField,
          }),
          removedStatusReason: new FormControl({
            value: lstReq.removedStatusReason,
            disabled: disableFormField,
          }),
        });

        const narrativeSummForm = new FormGroup({
          lstingReason: new FormControl({
            value: data.lstngReason,
            disabled: disableFreeTxtField,
          }),
          addtlInfo: new FormControl({
            value: data.addtlInfo,
            disabled: disableFreeTxtField,
          }), //fixme
          reltedLst: new FormControl({
            value:
              data.narrativeSumm && data.narrativeSumm.relatedLst
                ? data.narrativeSumm.relatedLst
                : null,
            disabled: disableFormField,
          }),
          availDte: new FormControl({
            value: data.availDte,
            disabled: disableFormField,
          }),
          narrWebsteUpdteDte: this.createNarrUpdteOn(),
          srchRelatedLstArr: this.fb.array([]),
        });
        // set the primary name here
        // set the refNum here for the heading
        const identityy: Identity = data.idArr && data.idArr[0];
        this.primaryName =
          identityy && identityy.names && identityy.names['names'][0].name;
        if (identityy && identityy.names && identityy.names['names'].length > 1) {
          this.primaryName = '';
          identityy.names['names'].forEach((element, index) => {
            if(index < 3) {
              this.primaryName += element.name + ' ';
            }
          });
        }

        if (isAmend) {
          disableFormField = false;
          this.ngxsSanctStatus = data.status = 'PENDING';
          lstReqForm.enable();
          narrativeSummForm.enable();
          this.sanctionForm.enable();
        }

        // ensure this data structure can fit multiple identities
        this.sanctionForm = this.fb.group({
          narrativeSumm: narrativeSummForm,
          lstReq: lstReqForm,
        });

        sanctionData = data;
        this.submitReviewConfirmed = data['isSubmitForReviewConfirmed'];
        this.isReady = true;

        let relatedListArr = [];
        if (data.narrativeSumm && data.narrativeSumm.relatedLst.length > 0) {
          relatedListArr = data.narrativeSumm.relatedLst.map((defaultItem) => {
            this.searchRelatedLstResult = relatedListArr;
            const item = {
              item: {
                name: '',
                RefNum: defaultItem
              }
            };
            this.searchRelatedLstResult.push(item);
            const tmp: FormGroup = new FormGroup({
              sanctionedRelLstName: new FormControl(''),
              sanctionedRelLstRefNum: new FormControl(defaultItem),
            });
            (<FormArray>(
              this.sanctionForm.get('narrativeSumm').get('srchRelatedLstArr')
            )).push(tmp);
            return(
              {
                sanctionedRelLstName: "",
                sanctionedRelLstRefNum: defaultItem,
              }
            )})
        };

        // detect change
        this.cd.detectChanges();
        resolve(true);
      });
    });
  }

  populateFormNewEntrydata() {
    this.isReadOnly = false;
    this.submittedByDataSrc.data = null;
    this.activeRouter.paramMap.subscribe(
      (params) => {
        const entryTypeName = decodeURI(params.get('entryTypeName'));
        const language = params.get('language');
        this.regime = params.get('regime');
        this.recordType = entryTypeName;
        this.lang = params.get('language') || this.workingMainLanguage;
        this.lowLang = this.lang.toLowerCase(); //fixme
        const entryTypeObj = this.lookupLst$.entryType.find(
          (item) => item['EN']['entryTypeName'] === entryTypeName
        );
        const statusObj = this.lookupLst$.entryStatus.find(
          (item) => item['EN'] === 'PENDING'
        );
        const status = statusObj[this.lang];

        const regime = params.get('regime');

        const lstReqForm = new FormGroup({
          recordTyp: new FormControl({
            value: entryTypeObj[this.lang]['entryTypeName'],
            disabled: false,
          }),
          status: new FormControl({ value: status, disabled: false }, [
            Validators.required,
            Validators.pattern('^((?!Select).)*$'),
          ]),
          regime: new FormControl({ value: regime, disabled: false }),
          language: new FormControl({ value: language, disabled: false }),
          refNum: new FormControl({ value: '', disabled: true }),
          interpolNum: new FormControl({ value: '', disabled: false }),
          mbmrStConfid: new FormControl({ value: false, disabled: false }),
          submittdBy: this.createSubmittedBy(null),
          submittdOn: new FormControl({ value: '', disabled: false }),
          lstngNotes: new FormControl({ value: '', disabled: false }),
          stmntConfid: new FormControl({ value: '', disabled: false }),
          applicableMeasures: new FormArray(this.getActiveMeasuresArr(regime)),
          presRelesee: new FormControl({ value: '', disabled: true }),
          entryRemarks: new FormControl(''),
          removedStatusDte: new FormControl({ value: '', disabled: false }),
          removedStatusReason: new FormControl({ value: '', disabled: false }),
        });
        const narrativeSummForm = new FormGroup({
          lstingReason: new FormControl({ value: '', disabled: false }),
          addtlInfo: new FormControl({ value: '', disabled: false }),
          reltedLst: new FormControl({ value: '', disabled: false }),
          availDte: new FormControl({ value: '', disabled: false }),
          narrWebsteUpdteDte: this.createNarrUpdteOn(),
          srchRelatedLstArr: this.fb.array([]),
        });

        // ensure this data structure can fit multiple identities
        this.sanctionForm = this.fb.group(
          {
            narrativeSumm: narrativeSummForm,
            lstReq: lstReqForm,
          },
          { updateOn: 'submit' }
        );
        this.isReady = true;
        this.ngxsSanctStatus = 'Init';
        this.tabs.push({ tabIndex: '' + 1 + '' });

        // make new forms editable
        this.submittedBycountryNamesDisplayedCols.push({
          property: 'editColumn',
          name: '',
        });
        this.submittedBycountryNamesDisplayedColsArr.push('editColumn');
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  getActiveMeasuresArr(regimeStrVal: string): FormControl[] {
    const output = regimeStrVal.split('--');
    const index = parseInt(output[0]);

    const regimeVal = this.getRegimes();
    const measuresKey = Object.keys(regimeVal)[0];

    const measuresArr = this.lookupLst$.measures;
    const activeMeasureNames = measuresArr.filter(measure => measure[this.lang].isActive).map(measure => measure[this.lang].measureNm);

    if (
      (measuresKey != null || measuresKey !== undefined) &&
      regimeVal[index][this.lang]['measures'] !== undefined
    ) {
      this.regimeMeas = regimeVal[index][this.lang]['measures'].filter(measure => activeMeasureNames.includes(measure));

      const checkboxes = this.regimeMeas.map(
        (option: any) => new FormControl(false, { updateOn: 'blur' })
      );
      return checkboxes;
    } else {
      return [];
    }
  }

  getApplicableMeasures(
    regimeMeasures: string[],
    currentlyassociatedMeasuresArr
  ): FormControl[] {
    // compare the currentlyassociatedMeasurs with the regime measures. For those that are the same we make those checkboxes true
    const checkboxArr: FormControl[] = [];
    let isMatchFound = false;
    if (
      regimeMeasures != null &&
      regimeMeasures !== undefined &&
      regimeMeasures.length > 0
    ) {
      if (
        currentlyassociatedMeasuresArr == null ||
        currentlyassociatedMeasuresArr.length == 0 ||
        currentlyassociatedMeasuresArr[0] == ''
      ) {
        for (let i = 0; i < regimeMeasures.length; i++) {
          checkboxArr.push(new FormControl(isMatchFound, { updateOn: 'blur' }));
        }
      } else {
        for (let i = 0; i < regimeMeasures.length; i++) {
          for (let j = 0; j < currentlyassociatedMeasuresArr.length; j++) {
            if (regimeMeasures[i] == currentlyassociatedMeasuresArr[j]) {
              isMatchFound = true;
              checkboxArr.push(
                new FormControl(
                  { value: isMatchFound, disabled: this.isReadOnly },
                  { updateOn: 'blur' }
                )
              );
              break;
            }
          }
          if (isMatchFound) {
            isMatchFound = false;
            continue;
          }
          checkboxArr.push(
            new FormControl(
              { value: isMatchFound, disabled: this.isReadOnly },
              { updateOn: 'blur' }
            )
          );
        }
      }
    }
    return checkboxArr;
  }

  translationMarkAsCompleted() {
    this.sancinputSvc
      .markAsCompleted(this.lang, parseInt(this.sanctionId))
      .subscribe(
        (data) => {
          this.isTranslated = true;
          const comments = `Entry translated in ${this.lang}`;
          const refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
            .controls['refNum'].value;
          const pressRelease: any = {
            entryId: parseInt(this.sanctionId),
            pressRelease: this.sanctionForm.value.pressRelease,
            updateType: this.sanctionForm.value.updteType,
            updatedOn: this.sanctionForm.value.listedOn,
            pressReleaseId: '',
            refNum: refNum,
          };
          // @ts-ignore
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            this.ngxsSanctStatus,
            comments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            pressRelease,
            true
          );
          this.getTranslationStatus();
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  getTranslationStatus() {
    this.sancinputSvc.getTranslationStatus(parseInt(this.sanctionId)).subscribe(
      (data: any) => {
        this.translationStatus = data;
        this.canBePublished =
          this.translationStatus &&
          this.langArr.every(
            (item) =>
              this.workingMainLanguage == item || this.translationStatus[item]
          );
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  onChange(indexx): FormArray {
    const output = indexx.split(' ');
    const index = parseInt(output[0]);
    const regimeVal = this.getRegimes();
    const measuresKey = Object.keys(regimeVal)[1];
    if (measuresKey != null || measuresKey !== undefined) {
      this.regimeMeas = regimeVal[index]['measures'];
    }

    if (this.regimeMeas && this.regimeMeas.length > 0) {
      const checkboxes = this.regimeMeas.map(
        (option: any) => new FormControl(true, { updateOn: 'blur' })
      );

      const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
        'applicableMeasures'
      ) as FormArray;
      while (applMeasures.length > 0) {
        applMeasures.removeAt(0);
      }
      for (let count = 0; count < checkboxes.length; count++) {
        applMeasures.push(checkboxes[count]);
      }
      return;
    } else {
      // get a reference to the formArray and remove the old applicableMeasures
      const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
        'applicableMeasures'
      ) as FormArray;
      while (applMeasures.length > 0) {
        applMeasures.removeAt(0);
      }
      return;
    }
  }

  createSubmittedByDataSrc(data: SanctionInputEntry) {
    if (data && data.submittdBy) {
      const tmpData = data.submittdBy.map((i) => {
        const countryLabel = (this.lookupLst$.un_country_list['record'] as [
          { UN_name: string; Short_name: string }
        ]).find((country) => country.UN_name === i)[
          `${this.lang.toLowerCase()}_Short`
        ];
        return { submittedby: countryLabel };
      });
      return tmpData;
    } else {
      return null;
    }
  }

  getIndexAndValue(arrayOfVals, someVal: string) {
    let resultArr = {};
    for (let i = 0; i < arrayOfVals.length; i++) {
      const obj = arrayOfVals[i];
      if (obj[Object.keys(obj)[0]]['QD'] == someVal) {
        const result = i + ' ' + someVal;
        resultArr = {
          rkey: result,
          rmeas: arrayOfVals[i][this.lang]['measures'],
        };
        break;
      }
    }
    return resultArr;
  }

  getRegimeMeasures(options: any[]) {
    const measuresObj = {};
    if (options != null && options.length > 0) {
      this.previouslyChekApplicableMeasures.push(options);
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        measuresObj[option] = true;
      }
    }
    return this.fb.group(measuresObj, { updateOn: 'blur' });
  }

  getApplicableMeasuresValues(): string[] {
    const applicableMeas: string[] = [];
    const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
      'applicableMeasures'
    ) as FormArray;
    for (let i = 0; i < applMeasures.length; i++) {
      if (applMeasures.controls[i].value) {
        applicableMeas.push(this.regimeMeas[i]);
      }
    }
    return applicableMeas;
  }

  getMeasures(regimeMeasuresObj): string[] {
    if (regimeMeasuresObj == null || regimeMeasuresObj === undefined) {
      return null;
    } else {
      const measuresKeysArr = Object.keys(regimeMeasuresObj);
      const measuresArr = [];

      for (let i = 0; i < measuresKeysArr.length; i++) {
        if (regimeMeasuresObj[measuresKeysArr[i]] == true) {
          measuresArr.push(measuresKeysArr[i]);
        }
      }
      return measuresArr;
    }
  }

  getNarrowWebsiteUpdates(websiteUpdatesArr): string[] {
    const websiteUpdates = [];
    for (let i = 0; i < websiteUpdatesArr.length; i++) {
      const tmp: {} = websiteUpdatesArr[i];
      websiteUpdates.push(tmp['narrWbSteDte']);
    }
    return websiteUpdates;
  }

  getEntryTypeIndividual(): string[] {
    const tmp = this.lookupLst$['entryType'].filter((item) => item['EN']['entryTypeName'] === 'Individual')[0];
    return tmp[this.lang]['entryTypeName'];
  }

  addPublishDialogRef: MatDialogRef<PublishDialogComponent>;

  openPublishDialog(): void {
    const text = this.sanctionDta.amendmentId ? 'AMENDED_ON' : 'LISTED_ON'; //fixme
    const sanctionId = this.sanctionId;
    const entryTypeTh = this.getEntryTypeIndividual();
    const nationalities = this.lookupLst$.un_country_list['record'];

    const dialogRef = this.dialog.open(PublishDialogComponent, {
      width: this.DIALOG_MD,
      data: {
        title: 'Publish',
        updateType: text,
        sanctionId: sanctionId,
        lang: this.lang,
        entryId: this.sanctionId,
        allAmendmentInfo: this.allAmendmentInfo,
        sanctionData: this.sanctionDta,
        nationalities,
        translations: this.translations,
        entryTypeTh,
      },
      hasBackdrop: true,
    });
    this.addPublishDialogRef = dialogRef;
  }

  async publish() {
    this.openPublishDialog();
    this.addPublishDialogRef
      .afterClosed()
      .subscribe(
        (result) => {
          if (!result) return;

          const { publishFormDialog, supersedeOthers } = result;
          if (publishFormDialog) {
            this.isLoading = true;
            const regimeVal = (<FormGroup>(
              this.sanctionForm.controls['lstReq']
            )).controls['regime'].value.split('--')[1];
            let regimeID = '';
            this.lookupLst$.regime.forEach(
              regime => {
                Object.keys(regime[this.lang]).forEach(
                  key => {
                    if (regime[this.lang][key] == regimeVal) {
                      regimeID = key;
                    }
                  }
                );
              }
            );

            const recordType = (<FormGroup>(
              this.sanctionForm.controls['lstReq']
            )).controls['recordTyp'].value.toLowerCase();
            const refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
              .controls['refNum'].value;
            const presRTxt = publishFormDialog.value.pressRelease || 'N/A';
            const pressRelease: any = {
              entryId: parseInt(this.sanctionId),
              pressRelease: presRTxt,
              updateType: publishFormDialog.value.updteType,
              updatedOn: publishFormDialog.value.listedOn,
              pressReleaseId: '',
              refNum,
            };

            const nextStatus = 'ACTIVE';
            const sanctionData: SanctionInputEntry = null;
            if (!refNum || refNum === undefined) {
              // if there was no ref number before, then we send one along to document record
              const regimeVal1 = { id: regimeID };
              const refNumPromise = this.sancinputSvc
                .createRetrieveRefCounter(regimeVal1)
                .toPromise();
              refNumPromise.then((refNumResult) => {
                const entryType = recordType[0];

                if (refNumResult) {
                  const seq = refNumResult['seq'];
                  // check width of string, if not prepend leading zeros, for a mzx width of three characters
                  const leadingZeros = ('000' + seq.toString()).slice(-3);
                  const regimePrefix = refNumResult['_id'];
                  const refNum = regimePrefix.concat(
                    entryType,
                    '.',
                    leadingZeros
                  );
                  pressRelease.refNum = refNum;
                }
                const websteDtesUpdte = this.getNarrowWebsiteUpdates(
                  this.sanctionForm.value.narrativeSumm.narrWebsteUpdteDte
                );
                const formRef = this.sanctionForm.value;
                const relatedLstArr: string[] = this.getRelatedLstArr(
                  this.sanctionForm
                );
                const identityArr: Identity[] = [];
                const errChildForm = [];

                function createIdentityArr(oneChild) {
                  const identity: Identity = oneChild.identityForm.value;
                  // when a selection is disabled, we lose its value in the form
                  if (
                    oneChild.identityForm.controls.idType.status ==
                      'DISABLED' &&
                    oneChild.identityForm.controls.idType.value == 'PRIMARY'
                  ) {
                    identity.idType = 'PRIMARY';
                    identity.category = 'High';
                  }
                  identityArr.push(identity);
                }

                this.idCmpChildren.forEach(createIdentityArr);
                this.errIdentityChildForm = errChildForm;
                this.loadSanctionsDetails(
                  this.lang,
                  null,
                  parseInt(this.sanctionId, 10),
                  sanctionData,
                  null
                ).then((data: any) =>
                  this.fillupSanctionDetails(
                    sanctionData,
                    nextStatus,
                    pressRelease,
                    false,
                    data,
                    supersedeOthers,
                  )
                );

                return refNum;
              }).catch(err => {
                console.log(err.message);
              });
            } else {
              const isAmend = true;
              this.loadSanctionsDetails(
                this.lang,
                null,
                parseInt(this.sanctionId, 10),
                sanctionData,
                this.amendmentId,
              ).then((data: any) => {
                this.fillupSanctionDetails(
                  sanctionData,
                  nextStatus,
                  pressRelease,
                  isAmend,
                  data,
                  supersedeOthers,
                );
              });
            }
          }
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  addSubmitted4ReviewDialogRef: MatDialogRef<Submitted4ReviewDialogComponent>;

  openSubmitted4ReviewDialog(amendmentID: string): void {
    const text = this.getTranslation(
      'The record status will change to \'submitted for review\'.  Do you want to continue?'
    );

    if (this.addSubmitted4ReviewDialogRef != null) {
      this.addSubmitted4ReviewDialogRef = null
    }

    const dialogRef = this.dialog.open(Submitted4ReviewDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: this.getTranslation('Submit for Review'),
        text: text,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result) {
          this.queryStatus = 'SUBMIT4REVIEW';
          const router = this.router;
          this.navigationSubscription = this.activeRouter.paramMap.subscribe(
            (params) => {
              this.refNum = params.get('refNum');
              const sanctionId = params.get('id');
              const lang = 'EN';
              let amendmentId = params.get('amendmentId');
              if (!amendmentId) {
                amendmentId = amendmentID;
              }

              if (params.get('amendmentCt')) {
                this.amendmentCt = parseInt(params.get('amendmentCt'), 10);
              }
              if (params.get('supersededCt')) {
                this.supersededCt = parseInt(params.get('supersededCt'), 10);
              }
              if (params.get('amendmentStatus')) {
                this.amendmentStatus = params.get('amendmentStatus');
                this.isAmendment = true;
              }

              // invoke backend's SubmitForReview which will update all SanctionsEntries for each language, but return the language entry just for what is onscreen
              this.sancinputSvc
                .submitForReview(lang, parseInt(sanctionId, 10), amendmentId)
                .subscribe((data) => {
                  router.navigateByUrl('/submitted-entries');
                  this.addSubmitted4ReviewDialogRef = null;
                  return result;
                });
            }
          );
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addSubmitted4ReviewDialogRef = dialogRef;
  }

  submitReview() {
    let amendmentId = null;
    if (
      this.pendingData != null &&
      this.pendingData['data'] != null &&
      this.pendingData['data'].sanctionEntry != null
    ) {
      amendmentId = this.pendingData['data'].sanctionEntry.amendmentId;
    }
    this.openSubmitted4ReviewDialog(amendmentId);
  }

  makeFormEditable() {
    if (
      this.workingMainLanguage ==
      this.sanctionForm.get('lstReq').get('language').value
    ) {
      // here comes edit mode
      this.sanctionForm.get('lstReq').enable();
      this.submittedBycountryNamesDisplayedCols.push({
        property: 'editColumn',
        name: '',
      });
      this.submittedBycountryNamesDisplayedColsArr.push('editColumn');
      this.sanctionForm.get('narrativeSumm').enable();

      this.isReadOnly = false;
      this.isEditMode = true;
      this.isTranslationMode = false;
      const tmpReadOnly = this.isReadOnly;
      this.isFreeTextEditable = true;
      this.isEditableLiviginStatusAndGender = true;

      this.idCmpChildren.map((id) => {
        id.changeTblRowDisp(tmpReadOnly);
      });
      this.isEditableLiviginStatusAndGender = true;
      this.prevSanctionData = this.sanctionForm.value;
    } else {
      // here's review translation mode
      this.sanctionForm.get('lstReq').enable();
      this.sanctionForm.get('narrativeSumm').enable();
      this.prevSanctionData = this.sanctionForm.value;
      this.sanctionForm.get('lstReq').disable();
      this.sanctionForm.get('narrativeSumm').disable();
      this.sanctionForm.get('lstReq').get('lstngNotes').enable();
      this.sanctionForm.get('lstReq').get('stmntConfid').enable();
      this.sanctionForm.get('lstReq').get('entryRemarks').enable();
      this.sanctionForm.get('narrativeSumm').get('addtlInfo').enable();
      this.sanctionForm.get('narrativeSumm').get('lstingReason').enable();
      this.isFreeTextEditable = true;
      this.isReadOnly = false;
      this.isEditMode = true;
      this.isTranslationMode = true;
    }
    this.prevIdentityData = this.idCmpChildren.map((item) => item.identityForm.value);
  }

  openWarningDialog(description: string): void {
    if (this.warningDialogRef != null) {
      return;
    }

    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Warning',
        appLang: this.lang,
        langArr: this.langArr,
        description: description
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.warningDialogRef = null;
    });
    this.warningDialogRef = dialogRef;
  }

  onChangeRegime(event, index) {
    const regimeMeasures = index >= 0 && this.lookupLst$.regime[index][this.lang].measures;

    const measuresArr = this.lookupLst$.measures;
    const filterdMeasureNames = measuresArr.filter(measure => !measure[this.lang].isActive).map(measure => measure[this.lang].measureNm);
    const filteredMeasures = regimeMeasures.filter(regimeMeasure => !filterdMeasureNames.includes(regimeMeasure));

    const checkboxes = this.getApplicableMeasures(
      filteredMeasures,
      this.measureArr
    );

    this.regimeMeas = filteredMeasures;

    const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
      'applicableMeasures'
    ) as FormArray;

    while (applMeasures.length > 0) {
      applMeasures.removeAt(0);
    }

    for (let count = 0; count < checkboxes.length; count++) {
      applMeasures.push(checkboxes[count]);
    }
  }

  async makeFormNonEditable(btnClicked) {
    if (
      this.submittedBycountryNamesDisplayedColsArr.findIndex(
        (item) => item === 'editColumn'
      ) >= 0
    ) {
      this.submittedBycountryNamesDisplayedColsArr.pop();
      this.submittedBycountryNamesDisplayedCols.pop();
    }
    if (btnClicked == 'Save' || btnClicked == 'SaveClose') {
      const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
        'applicableMeasures'
      ) as FormArray;

      const names = this.idCmpChildren.last.identityForm.value.names;

      if (( applMeasures.length > 0 && !this.getApplicableMeasuresValid() ) || names.length < 1 ) {
        let description = '';
        if (( applMeasures.length > 0 && !this.getApplicableMeasuresValid() ) && names.length < 1 ) {
          description = 'Please select at least one measure and please input at least a single name!';
        } else if ( names.length < 1 ) {
          description = 'Please input at least a single name!';
        } else {
          description = 'Please select at least one measure!';
        }
        this.openWarningDialog(description);
        return;
      }

      this.sanctionForm.get('narrativeSumm').enable();
      this.sanctionForm.get('lstReq').enable();

      // now save to the database
      if (this.checkChanged()) {
        await this.onSubmit(false);
      } else {
        await this.populateFormWSanctionData(false);
      }

      if (btnClicked == 'SaveClose') {
        this.sanctionForm.get('lstReq').disable();
        this.sanctionForm.get('narrativeSumm').disable();
        this.isEditMode = false;
        this.isTranslationMode = false;
        this.isReadOnly = true;
        this.isFreeTextEditable = false;
        this.idCmpChildren.map((id) => {
          id.changeTblRowDisp(this.isReadOnly);
        });
      }
    } else if (btnClicked == 'Cancel') {
      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: this.DIALOG_SM,
        data: {
          title: 'Warning',
          appLang: this.lang,
          langArr: this.langArr,
          description: this.getTranslation('Unsaved changes will be discarded'),
          hasCancelButton: true
        },
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.populateFormWSanctionData(false);
          this.sanctionForm.get('narrativeSumm').disable();
          this.sanctionForm.get('lstReq').disable();
          this.isReadOnly = true;
          this.isEditMode = false;
          this.isTranslationMode = false;
          if (this.ngxsSanctStatus == 'SUBMIT4REVIEW') {
            // this.isFreeTextEditable = false;
          }
          this.idCmpChildren.map((id) => {
            id.changeTblRowDisp(this.isReadOnly);
          });
          this.isFreeTextEditable = false;
        }
      });
    }
    this.isEditableLiviginStatusAndGender = false;

    if (btnClicked == 'Save') {
      this.makeFormEditable();
    }
  }

  checkChanged(): boolean {
    return (
      !_.isEqual(this.prevSanctionData, this.sanctionForm.value) ||
      !_.isEqual(this.prevIdentityData, this.idCmpChildren.map(item => item.identityForm.value))
    );
  }

  saveEditedFreeText() {
    const identityArr: Identity[] = [];

    function createIdentityArr(oneChild) {
      const identity: Identity = oneChild.identityForm.value;
      // when a selection is disabled, we lose its value in the form
      if (
        oneChild.identityForm.controls.idType.status == 'DISABLED' &&
        oneChild.identityForm.controls.idType.value == 'PRIMARY'
      ) {
        identity.idType = 'PRIMARY';
        identity.category = 'High';
      }

      if (oneChild.identityForm.invalid) {
      }
      identityArr.push(identity);
    }

    this.idCmpChildren.forEach(createIdentityArr);
    const userEmail = fakeUser.enabled
      ? fakeUser.userName
      : this.adalService.userInfo.userName;
    let sanctionMetaData = null;
    sanctionMetaData = this.sanctionDta['sanctionMetaData'];
    const relatedLstArr: string[] = this.getRelatedLstArr(this.sanctionForm);
    const regimes: string = this.sanctionForm.controls.lstReq['controls'].regime
      .value;
    const regimeVal = regimes.split('--')[1];
    const websteDtesUpdte = this.getNarrowWebsiteUpdates(
      this.sanctionForm.value.narrativeSumm.narrWebsteUpdteDte
    );
    const sanctionStatus = 'SUBMIT4REVIEW';
    const formRef = this.sanctionForm.value;

    const sanctionEntry = new SanctionInputEntry(
      formRef.lstReq.recordTyp,
      sanctionStatus,
      formRef.lstReq.interpolNum,
      regimeVal,
      formRef.lstReq.refNum,
      formRef.lstReq.lstngNotes,
      formRef.lstReq.mbrStConfid,
      formRef.lstReq.submittdBy,
      formRef.lstReq.submittdOn,
      formRef.narrativeSumm.lstingReason,
      formRef.narrativeSumm.addtlInfo,
      relatedLstArr,
      formRef.narrativeSumm.availDte,
      this.sanctionId,
      identityArr,
      this.sanctionForm.value.lstReq,
      this.sanctionForm.value.narrativeSumm,
      this.getApplicableMeasuresValues(),
      websteDtesUpdte,
      formRef.lstReq.removedStatusDte,
      formRef.lstReq.removedStatusReason,
      null,
      null,
      formRef.statementConfid,
      null,
      null,
      formRef.lstReq.entryRemarks,
      sanctionMetaData,
      this.workingMainLanguage,
      userEmail,
      this.sanctionForm.controls.lstReq['controls'].language.value
    );

    this.sancinputSvc.submitForReviewOtherLangs(sanctionEntry).subscribe(
      // we set status to PENDING, but may have to set amendment, rptStatus, ancestorArr, etc.
      (data) => {
        this.isFreeTextEditable = false;
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  wrkFlwVersHistDialogRef: MatDialogRef<WorkflowVersionsComponent>;

  openWrkFlwVersHistDialog(): void {
    const dialogRef = this.dialog.open(WorkflowVersionsComponent, {
      width: this.DIALOG_LG,
      data: {
        title: this.getTranslation('Version history'),
        entryId: this.sanctionId,
        name: this.primaryName,
        ongoingAmendments: this.allAmendmentInfo,
        lang: this.lang,
        translations: this.translations,
        refNum: this.refNum,
        entryStatus: this.queryStatus,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: any) => {
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.wrkFlwVersHistDialogRef = dialogRef;
  }

  updateStateAndActivityLog(
    sanctionFromValue,
    sanctionId,
    currState: string,
    nextState: string,
    notes: string,
    userEmail: string,
    pressRelease: PressReleaseintf,
    translate: boolean = false
  ) {
    // create teh activityLog then call the db backend for the record
    // amendmentInfo, rptStatusDates, siblingsArr, supersededInfo, updatedArr need the docUnderscoreId of document to save in either siblings array or as an ancestor
    const rptStatus = {};
    rptStatus['rptStatusCount'] = this.sanctionDta['rptStatusCount'];
    rptStatus['rptStatusDates'] = this.sanctionDta['rptStatusDates'];
    const stateMetaDataObj = {};
    stateMetaDataObj['amendmentInfo'] = this.sanctionDta['amendmentInfo'];
    stateMetaDataObj['docUnderscoreId'] = this.sanctionDta['docUnderscoreId'];
    stateMetaDataObj['siblingsArr'] = this.sanctionDta['siblingsArr'];
    stateMetaDataObj['supersededInfo'] = this.sanctionDta['supersededInfo'];
    stateMetaDataObj['ancestorsArr'] = this.sanctionDta['ancestorsArr'];
    stateMetaDataObj['rptStatusInfo'] = rptStatus;
    let tmp = null;
    if (pressRelease) {
      tmp = pressRelease.refNum;
    }
    const activityLg = new ActivityLog(
      new Date(),
      userEmail,
      nextState,
      currState,
      nextState,
      notes,
      tmp,
      parseInt(this.sanctionId)
    );
    if (
      nextState == 'ACTIVE' ||
      nextState == 'Active' ||
      nextState == 'AMEND' ||
      nextState == 'DELISTED'
    ) {
      this.updatePressRelease(pressRelease, parseInt(this.sanctionId));
    }
    this.sancinputSvc
      .postUpdateActivityLog(activityLg, stateMetaDataObj, pressRelease, translate)
      .subscribe(
        (data) => {
          const updateActivityLogs = data['activityLog'];
          this.createActivityLog(updateActivityLogs);
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  saveNewEntry() {
    const applMeasures = (<FormGroup>this.sanctionForm.get('lstReq')).get(
      'applicableMeasures'
    ) as FormArray;
    const names = this.idCmpChildren.last.identityForm.value.names;

    if (( applMeasures.length > 0 && !this.getApplicableMeasuresValid() ) || names.length < 1 ) {
      let description = '';
      if (( applMeasures.length > 0 && !this.getApplicableMeasuresValid() ) && names.length < 1 ) {
        description = 'Please select at least one measure and please input at least a single name!';
      } else if ( names.length < 1 ) {
        description = 'Please input at least a single name!';
      } else {
        description = 'Please select at least one measure!';
      }
      this.openWarningDialog(description);
      return;
    }
    this.onSubmit(false);
  }

  onSubmit(isNavigatable: boolean) {
    return new Promise((resolve, reject) => {
      const relatedLstArr: string[] = this.getRelatedLstArr(this.sanctionForm);
      const identityArr: Identity[] = [];
      const formRef = this.sanctionForm.value;
      const regimeVal = formRef.lstReq.regime.split('--')[1].trim();
      const websteDtesUpdte = this.getNarrowWebsiteUpdates(
        this.sanctionForm.value.narrativeSumm.narrWebsteUpdteDte
      );
      const errChildForm = [];

      function createIdentityArr(oneChild) {
        const identity: Identity = oneChild.identityForm.value;
        // when a selection is disabled, we lose its value in the form
        if (
          oneChild.identityForm.controls.idType.status == 'DISABLED' &&
          oneChild.identityForm.controls.idType.value == 'PRIMARY'
        ) {
          identity.idType = 'PRIMARY';
          identity.category = 'High';
        }
        if (oneChild.identityForm.invalid) {
          errChildForm.push(oneChild.id);
        }
        identityArr.push(identity);
      }

      this.idCmpChildren.forEach(createIdentityArr);
      this.errIdentityChildForm = errChildForm;

      if (
        this.sanctionForm.status == 'INVALID' ||
        this.errIdentityChildForm.length > 0
      ) {
        if (this.sanctionForm.errors) {
          console.log(
            'the sacntions form is invalid, we will not process it to the db',
            this.sanctionForm.errors
          );
        }
      } else {
        const sanctionMetaData: SanctionMetaData = null;
        const userEmail = fakeUser.enabled
          ? fakeUser.userName
          : this.adalService.userInfo.userName;
        const workingMainLanguage = '';
        // const entryStatusObj = this.lookupLst$.entryStatus.find(item => item[this.lang] === formRef.lstReq.status);
        // const entryTypeObj = this.lookupLst$.entryType.find(item => item[this.lang] === formRef.lstReq.recordTyp);

        const sanctionEntry = new SanctionInputEntry(
          formRef.lstReq.recordTyp,
          formRef.lstReq.status,
          formRef.lstReq.interpolNum,
          regimeVal,
          formRef.lstReq.refNum,
          formRef.lstReq.lstngNotes,
          formRef.lstReq.mbrStConfid,
          formRef.lstReq.submittdBy,
          formRef.lstReq.submittdOn,
          formRef.narrativeSumm.lstingReason,
          formRef.narrativeSumm.addtlInfo,
          relatedLstArr,
          formRef.narrativeSumm.availDte,
          this.sanctionId,
          identityArr,
          formRef.lstReq,
          formRef.narrativeSumm,
          this.getApplicableMeasuresValues(),
          websteDtesUpdte,
          formRef.lstReq.removedStatusDte,
          formRef.lstReq.removedStatusReason,
          null,
          null,
          formRef.lstReq.statementConfid,
          null,
          null,
          formRef.lstReq.entryRemarks,
          sanctionMetaData,
          workingMainLanguage,
          userEmail,
          this.sanctionForm.controls.lstReq['controls'].language.value
        );

        if (this.sanctionId != null) {
          sanctionEntry.sanctionMetaData = this.sanctionDta['sanctionMetaData'];
          sanctionEntry.sanctionMetaData.nextState = this.sanctionDta[
            'nextState'
            ];
          sanctionEntry.sanctionMetaData.prevState = this.sanctionDta[
            'prevState'
            ];
          this.isLoading = true;
          this.sancinputSvc.updateSanctionForm(sanctionEntry).subscribe(
            async (data) => {
              this.pendingData = data;

              if (isNavigatable) {
                // go to pending Sanctions page after saving or updating the initial Sanction
                this.router.navigateByUrl('/pending-entries').then(
                  (nav) => {
                    console.log(nav);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              } else {
                this.isLoading = false;
                this.notifyService.showInfo('Entry was saved.', '');
                await this.populateFormWSanctionData(false);
                resolve(true);
              }
            },
            (error) => {
              this.isLoading = false;
              this.notifyService.showError(error, 'Error');
              reject();
            }
          );
        } else {
          // with no SanctionId, we have a status of New
          sanctionEntry.versionId = environment.version;
          sanctionEntry.sanctionMetaData = new SanctionMetaData('N/A');
          sanctionEntry.sanctionMetaData.userEmail = fakeUser.enabled
            ? fakeUser.userName
            : this.adalService.userInfo.userName;
          sanctionEntry.sanctionMetaData.workingMainLanguage = this.workingMainLanguage;

          this.isLoading = true;
          this.sancinputSvc.insertInitalSanctionForm(sanctionEntry).subscribe(
            (data) => {
              this.router.navigateByUrl('/pending-entries').then(
                (nav) => {
                },
                (err) => {
                  console.log(err);
                }
              );
            },
            (error) => {
              this.isLoading = false;
              this.notifyService.showError(error, 'Error');
              reject();
            }
          );
        }
      }
    });
  }

  onChangeNonOfficialLang(val) {
    if (this.isFreeTextEditable) {
      return;
    }

    this.lang = val || this.workingMainLanguage;
    this.lowLang = this.lang.toLowerCase();
    this.isSanctionDetailsCall = true;
    this.router.navigateByUrl(
      !this.refNum ?
        `/user/${this.sanctionId}/${this.queryStatus}?lang=${val}` :
        this.amendmentId ?
          `/user/${this.sanctionId}/${this.refNum}/${this.queryStatus}/${this.amendmentId}?lang=${val}` :
          `/user/${this.sanctionId}/${this.refNum}/${this.queryStatus}?lang=${val}`
    );
  }

  addTab(selectAfterAdding: boolean) {
    const i = this.tabs.length;
    this.tabs.push({ tabIndex: '' + (i + 1) + '' });

    if (selectAfterAdding) {
      this.selectedTab.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    const tmp: IdentityComponent[] = this.idCmpChildren
      .toArray()
      .slice(index, index + 1);
    const isDirtyForm = tmp[0].identityForm.dirty;
    let isRemoveForm = false;
    if (isDirtyForm) {
      isRemoveForm = confirm(
        `Do you really want to remove this tab ${index}, you will lose your changes`
      );
    } else {
      // start from index, remove ONLY a single element
      this.tabs.splice(index, 1);
      this.idCmpChildren.changes.subscribe(
        (list) => {
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
    }
  }

  testTabChag(ref, evnetRef) {
    ref.active = false;
    return false;
  }

  ngAfterViewInit() {
    this.idCmpChildren.changes.subscribe(
      (comps: QueryList<IdentityComponent>) => {
        // Now you can access to the child component
        if (this.idTabs) {
          this.idTabs.selectedIndex;
          let tabIndx = 0;
          this.idTabs._tabs.forEach((tb) => {
            if (tb.isActive) {
              this.currTabIndx = tabIndx;
            }
            tabIndx++;
          });
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  createName(): FormGroup {
    return this.fb.group({
      nameType: new FormControl(null, Validators.required),
      order: '',
      script: '',
      name: '',
    });
  }

  createNameOrgSpt(): FormGroup {
    return this.fb.group({
      nameType: new FormControl(null, Validators.required),
      order: '',
      script: '',
      name: '',
    });
  }

  calculateNextStatus(inputStatus: string) {
    let sanctionStatus = null;
    let isOnExtHold: boolean,
      isOnHold: boolean,
      isDelisted: boolean,
      isAmend: boolean,
      isRemoved = false;
    if (this.sanctionId == null || this.ngxsSanctStatus == 'Init') {
      sanctionStatus = 'PENDNG';
    } else if (this.ngxsSanctStatus == 'PENDNG') {
      sanctionStatus = 'SUBMIT4REVIEW'; // all fields will be readonly, we will have updated teh activity logs accordingly
    } else if (this.ngxsSanctStatus == 'SUBMIT4REVIEW' && isOnHold) {
      sanctionStatus = 'ONHOLD';
    } else if (this.ngxsSanctStatus == 'ONHOLD' && isOnExtHold) {
      sanctionStatus = 'ONEXTHOLD';
    } else if (this.ngxsSanctStatus == 'SUBMIT4REVIEW') {
      sanctionStatus = 'ACTIVE'; // Rich Text press RElease only editable fields and activitylog, plus readOnly fields
    } else if (this.ngxsSanctStatus == 'ACTIVE' && isDelisted) {
      sanctionStatus = 'DELISTED';
    } else if (this.ngxsSanctStatus == 'ACTIVE' && isRemoved) {
      sanctionStatus = 'DELETED';
    } else if (this.ngxsSanctStatus == 'ACTIVE' && isAmend) {
      sanctionStatus = 'AMEND';
    }
    return sanctionStatus;
  }

  addNewEntry(newEntryDialog): void {
    this.newEntry.push(this.fb.group(newEntryDialog));
    // for a new Entry, the status will ALWAYS be "PENDING"
    this.sanctionForm.controls['lstReq'].patchValue({
      recordTyp: (<FormArray>this.newEntry).value[0].entryType,
      regime: newEntryDialog.regime,
      language: (<FormArray>this.newEntry).value[0].language,
      status: 'PENDING',
    });
  }

  createNewEntry(): FormGroup {
    return this.fb.group({
      entryType: this.newEntry[0].entryType,
      Language: this.newEntry[0].language,
      regime: this.newEntry[0].regime,
    });
  }

  addStatusRemovedDialogRef: MatDialogRef<StatusRemovedDialogComponent>;

  openStatusRemovedDialog(): void {
    const dialogRef = this.dialog.open(StatusRemovedDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Update Removed Status information',
        entryType: this.lookupLst$.entryType,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result != null) {
          // update the requisite fields
          if (
            result.controls.removedStatusDte.status == 'INVALID' ||
            result.controls.removedStatusReason.status == 'INVALID'
          ) {
            this.sanctionForm.controls['lstReq'].patchValue({
              status: 'Select Status',
            });
          } else {
            this.sanctionForm.controls['lstReq'].patchValue({
              status: 'REMOVED',
            });
            this.sanctionForm.controls['lstReq'].patchValue({
              removedStatusDte: result.controls.removedStatusDte.value,
            });
            this.sanctionForm.controls['lstReq'].patchValue({
              removedStatusReason: result.controls.removedStatusReason.value,
            });
          }
        } else {
          this.sanctionForm.controls['lstReq'].patchValue({
            status: 'Select Status',
          });
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addStatusRemovedDialogRef = dialogRef;
  }

  addStatusDelistedDialogRef: MatDialogRef<StatusDelistedDialogComponent>;

  openStatusDelistedDialog(): void {
    const dialogRef = this.dialog.open(StatusDelistedDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Update Delisted Status information' },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result != null) {
          // update the requisite fields
          if (
            result.controls.delistedStatusDte.status == 'INVALID' ||
            result.controls.delistedStatusPRelease.status == 'INVALID'
          ) {
            this.sanctionForm.controls['lstReq'].patchValue({
              status: 'Select Status',
            });
          } else {
            // need to push values into array
            this.sanctionForm.controls['lstReq'].patchValue({
              status: 'DELISTED',
            });
            this.addDelistedStatus(
              result.controls.delistedStatusPRelease.value,
              result.controls.delistedStatusDte.value,
              'DELISTED_ON'
            );
          }
        } else {
          this.sanctionForm.controls['lstReq'].patchValue({
            status: 'Select Status',
          });
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addStatusDelistedDialogRef = dialogRef;
  }

  pressReleaseDialogRef: MatDialogRef<PressReleaseDialogComponent>;

  openPressReleaseDialog(data): void {
    const text = this.sanctionDta.amendmentId ? 'AMENDED_ON' : 'LISTED_ON';
    const sanctionId = this.sanctionId;
    const entryTypeTh = this.getEntryTypeIndividual();
    const nationalities = this.lookupLst$.un_country_list['record'];

    const dialogRef = this.dialog.open(PressReleaseDialogComponent, {
      width: this.DIALOG_MD,
       data: {
        title: 'Press Release',
        updateType: text,
        sanctionId: sanctionId,
        entryId: this.sanctionId,
        allAmendmentInfo: this.allAmendmentInfo,
        sanctionData: this.sanctionDta,
        entryTypeTh,
        nationalities,
        isReadOnly: true,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result != null) {
          // update the requisite fields
         
        } else {
        
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.pressReleaseDialogRef = dialogRef;
  }

  onEntryStatusChange(event) {
    if (event == 'REMOVED') {
      this.openStatusRemovedDialog();
    } else if (event == 'DELISTED') {
      this.openStatusDelistedDialog();
    }
  }

  getEntryStatusValue(status): string {
    return status.replace(/-/gi, '');
  }

  getPressReleseUpdtetyp(): string[] {
    return this.lookupLst$.pressReleaseUpdteTyp;
  }

  getLanguage(): {} {
    return this.lookupLst$.language;
  }

  getrecEntTyp(): {} {
    return this.lookupLst$.entryType;
  }

  entryStatus(): string[] {
    return this.lookupLst$.entryStatus;
  }

  getRegimes(): Regime[] {
    return this.lookupLst$.regime.filter(
      (item: Regime) => item[this.lang]['isActive'] === true
    ) as Regime[];
  }

  getScriptTypeKeys(): string[] {
    const tmp = this.lookupLst$.scriptType;
    return Object.keys(tmp);
  }

  getScriptTypeVals(key): string {
    const tmp = this.lookupLst$.scriptType;
    return tmp[key];
  }

  getKeysArr(obj: {}): string[] {
    return Object.keys(obj);
  }

  getValsArr(obj: {}, key: string): string {
    return obj[key];
  }

  getKeysFromArrayOfObjs(obj: {}): string {
    const idx = 0;
    const key = Object.keys(obj)[idx];

    return obj[key];
  }

  getRegimeValue(obj: {}): string {
    const key = Object.keys(obj).find(
      (item) => item !== 'isActive' && item !== 'measures'
    );
    return obj[key];
  }

  getArrOfKeys(myArr): string[] {
    const result = myArr.map(this.getKeysFromArrayOfObjs);
    return result;
  }

  getMembrState(): [{}] {
    const tmp1 = this.lookupLst$.un_country_list['record'];
    const resultCountry = tmp1.map((cntrys) => ({
      UN_name: cntrys.UN_name,
      Short_name: cntrys.en_Short,
    }));
    return resultCountry;
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
  }

  preview(): void {
    this.downloadTranslatedFile('entryPreview');
  }

  reviewActivate(): void {}

  addAmendDialogRef: MatDialogRef<AmendDialogComponent>;

  async reviewAmend() {
    const dialogRef = this.dialog.open(AmendDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: this.getTranslation('Amend'),
        text: 'Amendment will be created. Do you want to continue?',
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result) {
          this.isAmendment = true;
          const nextStatus = 'PENDING';
          this.sanctionDta['prevState'] = 'ACTIVE';
          this.sanctionDta['nextState'] = nextStatus;
          this.ngxsSanctStatus = nextStatus;
          this.makeFormEditable();
          this.onSubmit(true);
          this.addAmendDialogRef = null;
          return result;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addAmendDialogRef = dialogRef;
  }

  review(): void {
    this.openReviewDialog();
  }

  openReviewDialog(): void {
    const text = 'REVIEWED_ON';
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Record Review',
        updateType: text,
        sanctionId: this.sanctionId,
        refNum: this.refNum,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        // maybe just save refNum to the database directly
        if (result) {
          // need to know Regime and recordType so as to create RefNumber
          // let regime = (<FormGroup>this.sanctionForm.controls['lstReq']).controls['regime'].value;
          const refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
            .controls['refNum'].value;
          const nextState = 'ACTIVE'; // RECORDREVIEW
          const pressRelease: any = {
            // updateType and updatedOn are only two fields relevant here
            entryId: parseInt(this.sanctionId),
            pressRelease: result.value.pressRelease,
            updateType: result.value.updteType,
            updatedOn: moment(result.value.listedOn).format('MM.DD.YYYY'),
            pressReleaseId: '',
            refNum: refNum,
          };

          const deleteComments = result.value.deleteComment;
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            nextState,
            deleteComments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            pressRelease
          );
          this.ngxsSanctStatus = nextState;
          // change the FormGroups to RW
          (<FormGroup>this.sanctionForm.controls['lstReq']).disable();
          (<FormGroup>this.sanctionForm.controls['narrativeSumm']).disable();
          return result;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addReviewDialogRef = dialogRef;
  }

  delist(): void {
    this.openDelistDialog();
  }

  openDelistDialog(): void {
    const text = 'DE-LISTED';
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Delist',
        updateType: text,
        sanctionId: this.sanctionId,
        refNum: this.refNum,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        // need to know Regime and recordType so as to create RefNumber
        if (result) {
          const refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
            .controls['refNum'].value;
          const nextState = 'DELISTED';
          const pressRelease: any = {
            // updateType and updatedOn are only two fields relevant here
            entryId: parseInt(this.sanctionId),
            updateType: result.value.updateType,
            updatedOn: result.value.listedOn,
            refNum: refNum,
          };
          const deleteComments = 'N/A';
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            nextState,
            deleteComments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            pressRelease
          );
          this.ngxsSanctStatus = nextState;
          // change the FormGroups to RW
          (<FormGroup>this.sanctionForm.controls['lstReq']).disable();
          (<FormGroup>this.sanctionForm.controls['narrativeSumm']).disable();

          this.isReadOnly = true;
          this.router.navigateByUrl('/delisted-entries');
          return result;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addReviewDialogRef = dialogRef;
  }

  deleteSanction(): void {
    if (this.azureAuthService.userIsAdministrator() || this.azureAuthService.userIsSuperuser()) {
      this.openDeleteDialog();
    } else {
      alert('Permission denied!');
    }
  }

  addDeleteDialogRef: MatDialogRef<RemoveDialogComponent>;

  openDeleteDialog(): void {
    const refNum = (<FormGroup>this.sanctionForm.controls['lstReq']).controls[
      'refNum'
    ].value;
    const txt =
      'The record for ' +
      this.primaryName.substring(0, 40) +
      ' will be removed.  Do you want to continue?';
    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: this.getTranslation('Delete'),
        deleteTxt: txt,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        // maybe just save refNum to the database directly
        // need to know Regime and recordType so as to create RefNumber
        if (result) {
          const deleteComments = result.controls.deleteComment.value;
          const nextState = 'REMOVED';
          // need to make all the formGroups R
          // put in REMOVED status in database, but also keep deleted_on time/date and comments
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            nextState,
            deleteComments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            null
          );
          this.ngxsSanctStatus = nextState;
          // change the FormGroups to RW
          (<FormGroup>this.sanctionForm.controls['lstReq']).disable();
          (<FormGroup>this.sanctionForm.controls['narrativeSumm']).disable();
          this.isReadOnly = true;
          this.router.navigateByUrl('/removed-entries');
        }
        return result;
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addDeleteDialogRef = dialogRef;
  }

  onHoldSanction(): void {
    this.openOnholdDialog();
  }

  addOnHoldDialogRef: MatDialogRef<OnHoldDialogComponent>;

  openOnholdDialog(): void {
    const txt = 'The record will be placed on hold. Do you want to continue?';
    const dialogRef = this.dialog.open(OnHoldDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Place entry on hold',
        onHldTxt: txt,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        // maybe just save refNum to the database directly
        // need to know Regime and recordType so as to create RefNumber
        if (result) {
          const deleteComments = 'N/A';
          const nextState = 'ONHOLD';
          // need to make all the formGroups R
          // put in REMOVED status in database, but also keep deleted_on time/date and comments
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            nextState,
            deleteComments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            null
          );
          this.ngxsSanctStatus = nextState;
          // change the FormGroups to RW
          (<FormGroup>this.sanctionForm.controls['lstReq']).disable();
          (<FormGroup>this.sanctionForm.controls['narrativeSumm']).disable();
          this.isReadOnly = true;
          this.router.navigateByUrl('/onhold-entries');
        }
        return result;
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addOnHoldDialogRef = dialogRef;
  }

  onExtHoldSanction(): void {
    this.openOnExtHoldDialog();
  }

  addOnExtHoldDialogRef: MatDialogRef<OnExtHoldDialogComponent>;

  openOnExtHoldDialog(): void {
    const sanctionId = this.sanctionId;
    const txt =
      'The record for ' +
      sanctionId +
      ' will be placed on extended hold.  Do you want to continue?'; // get this from database reference from lookupCollProv
    const dialogRef = this.dialog.open(OnExtHoldDialogComponent, {
      width: this.DIALOG_SM,
      data: { title: 'Delete Sanction', extHldTxt: txt },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        // maybe just save refNum to the database directly
        // need to know Regime and recordType so as to create RefNumber
        if (result) {
          const deleteComments = result.controls.deleteComment.value;
          const nextState = 'ONHOLDEXTENDED';
          // need to make all the formGroups R
          // put in REMOVED status in database, but also keep deleted_on time/date and comments
          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            nextState,
            deleteComments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            null
          );
          this.ngxsSanctStatus = nextState;
          // change the FormGroups to RW
          (<FormGroup>this.sanctionForm.controls['lstReq']).disable();
          (<FormGroup>this.sanctionForm.controls['narrativeSumm']).disable();
          this.isReadOnly = true;
          return result;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addOnExtHoldDialogRef = dialogRef;
  }

  activate(): void {
    this.openActivateDialog();
  }

  openActivateDialog(): void {
    const text = 'Activation action for ';
    const sanctionId = this.sanctionId;  //fixme
    const dialogRef = this.dialog.open(ActivateDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Publish',
        updteType: text,
        sanctionId: sanctionId
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (result) {
          const regimeVal = (<FormGroup>(
            this.sanctionForm.controls['lstReq']
          )).controls['regime'].value.split('--')[1];
          const recordTyp = (<FormGroup>(
            this.sanctionForm.controls['lstReq']
          )).controls['recordTyp'].value.toLowerCase();
          let refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
            .controls['refNum'].value;
          const nextState = 'ACTIVE';
          // need to make all the formGroups RW
          const pressRelease: any = {
            // updateType and updatedOn are only two fields relevant here
            entryId: parseInt(this.sanctionId),
            updateType: result.value.updteType,
            updatedOn: result.value.listedOn,
            refNum: refNum,
          };
          if (!refNum) {
            // if there was no ref numb before, then we send one along to document record
            refNum = this.createAndRetrieveRefNum(
              regimeVal,
              recordTyp,
              pressRelease
            );
          } else {
            this.updateStateAndActivityLog(
              this.sanctionForm.value,
              this.sanctionId,
              this.ngxsSanctStatus,
              nextState,
              'N/A',
              fakeUser.enabled
                ? fakeUser.userName
                : this.adalService.userInfo.userName,
              pressRelease
            );
            this.ngxsSanctStatus = nextState;
            // change the FormGroups to RW
            (<FormGroup>this.sanctionForm.controls['lstReq']).enable();
            (<FormGroup>this.sanctionForm.controls['narrativeSumm']).enable();
            this.isReadOnly = false;
          }
          this.isReadOnly = true;
          this.router.navigateByUrl('/active-entries');
          return result;
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addActivateDialogRef = dialogRef;
  }

  showVersions(): void {
    console.log('in function showVersions');
  }

  updatePressRelease(pressRelease: any, entryId: number) {
    // call the backend to create a new sequence number, then return this number
    return new Promise((resolve) => {
      this.sancinputSvc.updatePressRelease(pressRelease).subscribe(
        (resData) => {
          const pr1 = [];
          this.presRelesee = new FormArray(
            resData['data'].map(function (presR) {
              const no = presR.scSanctionEntry.entry.listings.unListType[0].updates.updated.length - 1;
              const pr = presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no] ?
                presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['updateType'] +
                ': ' +
                presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['updatedOn'] +
                ' - ' +
                presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['pressRelease'] : null;
              pr1.push(pr);

              return new FormGroup({
                pressRelease: new FormControl({
                  value: presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['pressRelease'],
                  disabled: true,
                }),
                updateType: new FormControl({
                  value: presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['updateType'],
                  disabled: true,
                }),
                updatedOn: new FormControl({
                  value: presR.scSanctionEntry.entry.listings.unListType[0].updates.updated[no]['updatedOn'],
                  disabled: true,
                }),
              });
            })
          );
          this.testpressR = pr1.reverse();
          resolve(resData);
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
    });
  }

  async createAndRetrieveRefNum(
    regime: string,
    entryTyp: string,
    pressRelease: PressReleaseintf
  ) {
    // call the backend to create a new sequence number, then return this number
    const regimeVal = { regime: regime };
    const data = await this.sancinputSvc
      .createRetrieveRefCounter(regimeVal)
      .toPromise();
    const entryType = entryTyp[0].toLowerCase();
    const seq = data['seq'];

    // check width of string, if not prepend leading zeros, for a mzx width of three characters
    const leadingZeros = ('000' + seq.toString()).slice(-3);
    const regimePrefix = data['_id'];
    const refNum = regimePrefix.concat(entryType, '.', leadingZeros);
    pressRelease.refNum = refNum;
    this.ngxsSanctStatus = 'ACTIVE';
    return refNum;
  }

  submittedByRowClicked(row, i, isReadOnly) {
    this.submittedByDataSrc.data = this.submittedByDataSrc.data.filter(
      (item: any) => {
        return item.submittedby !== row.submittedby;
      }
    );
    this.submittdByArr.removeAt(i);
    this.submittedByDataSrc._updateChangeSubscription();
  }

  editSubmittedByRef: MatDialogRef<SubmittedByDialogComponent>;

  editSubmittedByDialog(row, index, isReadOnly: boolean): void {
    this.submittdByArr = this.sanctionForm
      .get('lstReq')
      .get('submittdBy') as FormArray;
    const alreadyChosenArr = [];
    this.submittdByArr.controls.map((ctrl) => {
      alreadyChosenArr.push(ctrl.value);
    });

    const dialogRef = this.dialog.open(SubmittedByDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Edit submitting Member State',
        countryLst: this.lookupLst$.un_country_list,
        editSubmittedByCountry: row['submittedby'],
        editRowIndex: index,
        isReadOnly: isReadOnly,
        alreadyChosen: alreadyChosenArr,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: DialogData) => {
        if (result) {
          this.submittedBy(result, index);
        }
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.editSubmittedByRef = dialogRef;
  }

  submittedBy(submittedByForm, index: number) {
    const editsubmittedByCtrl = this.sanctionForm
      .get('lstReq')
      .get(['submittdBy', index]) as FormControl;
    const tmpData = this.submittedByDataSrc.data;
    editsubmittedByCtrl.patchValue(submittedByForm['countrytoChoose']);
    tmpData[index] = { submittedby: submittedByForm['countrytoChoose'] };
    this.submittedByDataSrc.data = tmpData;
    this.cd.detectChanges();
    this.submittdByArr.removeAt(index);
    this.submittdByArr.push(new FormControl(tmpData[index]['submittedby']));
  }

  addSubmittedByDialogRef: MatDialogRef<SubmittedByDialogComponent>;

  openSubmittedByDialog(): void {
    if (this.addSubmittedByDialogRef) {
      return;
    }
    this.submittdByArr = this.sanctionForm
      .get('lstReq')
      .get('submittdBy') as FormArray;
    const alreadyChosenArr = [];
    this.submittdByArr.controls.map((ctrl) => {
      alreadyChosenArr.push(ctrl.value);
    });

    const dialogRef = this.dialog.open(SubmittedByDialogComponent, {
      width: this.DIALOG_SM,
      data: {
        title: 'Add submitting Member State',
        countryLst: this.lookupLst$.un_country_list,
        alreadyChosen: alreadyChosenArr,
        lang: this.lang,
        translations: this.translations,
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(
      (result: DialogData) => {
        if (result != null && result != undefined) {
          if (this.submittedByDataSrc.data == null) {
            this.submittedByDataSrc.data = [];
          }
          const tmpData = this.submittedByDataSrc.data;
          const countryLabel = (this.lookupLst$.un_country_list['record'] as [
            { UN_name: string; Short_name: string }
          ]).find((country) => country.UN_name === result['countrytoChoose'])[
            `${this.lang.toLowerCase()}_Short`
          ];
          tmpData.push({ submittedby: countryLabel });
          this.submittdByArr.push(new FormControl(result['countrytoChoose']));
          this.submittedByDataSrc.data = tmpData;
          this.cd.detectChanges();
        }
        this.addSubmittedByDialogRef = null;
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
    this.addSubmittedByDialogRef = dialogRef;
  }

  applyFilter(keyValue) {
    // searchRelatedLst
    const srchRltedLstCtrl: AbstractControl = (<FormGroup>(
      this.sanctionForm.get('narrativeSumm')
    )).get('reltedLst');
    // tslint:disable-next-line:prefer-const
    let results: Observable<RelatedLst[]>;
    let isProcessing = false;
    // don't search for empty string or string with less than two characters
    return srchRltedLstCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (isProcessing = true)),
        switchMap((fieldVal) =>
          fieldVal.length < 2
            ? []
            : this.sancLoadSrv.findEntryByRefNum(fieldVal).pipe(
                finalize(() => (isProcessing = false)),
                tap(() => console.log('finished with backend call'))
              )
        )
      )
      .subscribe(
        (resultz) => {
          this.searchRelatedLstResult = resultz;
          this.addSrchRelatedLst(this.sanctionForm);
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  resizeSrchRelatedLstArr(index) {
    const reltdFormArr = <FormArray>(
      this.sanctionForm.get('narrativeSumm').get('srchRelatedLstArr')
    );
    reltdFormArr.removeAt(index);
  }

  relatedLstArr: string[];

  selectedItem(item, reltedLstInput) {
    item.preventDefault();
    const reltdFormArr = <FormArray>(
      this.sanctionForm.get('narrativeSumm').get('srchRelatedLstArr')
    );
    const resFilter = reltdFormArr.value.filter(
      (c) => c.sanctionedRelLstRefNum == item.item.RefNum
    );
    if (resFilter.length > 0) {
      reltedLstInput.value = '';
      return;
    }
    this.searchRelatedLstResult.push(item);
    this.addSrchRelatedLst(item);
    reltedLstInput.value = '';
  }

  getRelatedLstArr(form: FormGroup): string[] {
    const reltdFormArr = <FormArray>(
      form.get('narrativeSumm').get('srchRelatedLstArr')
    );
    const relatedLstArr = [];
    reltdFormArr.controls.map((ctrl) => {
      relatedLstArr.push(ctrl.value.sanctionedRelLstRefNum);
    });
    return relatedLstArr;
  }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),

      switchMap((fieldVal) =>
        fieldVal.length < 1
          ? []
          : this.sancLoadSrv.findEntryByRefNum(fieldVal).pipe(tap((res) => {
            if (res.length === 0)  {
              this.relatedListSearchRes = res;
            }
          }))
      )
    )

  onClickSearchBtn = () => {
    if (this.relatedListSearchRes.length === 0) {
      this.notifyService.showWarning('No result for related search', 'Error');
    }
  }

  formatter = (x: { name: string; RefNum: string }) => {
    const res = x.RefNum + ' - ' + x.name;
    return res;
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  switchEntryLang(langId) {
    if (this.isFreeTextEditable) {
      return;
    }

    this.lang = langId || this.workingMainLanguage;
    this.lowLang = this.lang.toLowerCase();
    this.isSanctionDetailsCall = true;
    this.router.navigateByUrl(
      !this.refNum ?
        `/user/${this.sanctionId}/${this.queryStatus}?lang=${langId}` :
        this.amendmentId ?
          `/user/${this.sanctionId}/${this.refNum}/${this.queryStatus}/${this.amendmentId}?lang=${langId}` :
          `/user/${this.sanctionId}/${this.refNum}/${this.queryStatus}?lang=${langId}`
    );
  }

  initialiseInvites() {
    this.lookupCollprovider.load(this.lang).then(() => {
      this.lookupLst$ = this.lookupCollprovider.getLookupColl();
      this.translations = this.lookupCollprovider.getTranslations();
      this.populateFormWSanctionData(false);
    });
  }

  confirmSubmit4Review() {
    // updates the SanctionEntry submitForREview boolean flag - after this it is ready to be published
    // create a servcie to call the backend, pass in sanctionID, return a variable to indicate this field is seet
    const lang = this.lang;
    this.sancinputSvc
      .confirmSubmitForReview(this.sanctionId, this.lang)
      .subscribe(
        (result) => {
          const isSubmitReviewConfirmedNonMainLang =
            result['data'].scSanctionEntry['submitReviewConfirmed'];
          this.zone.run(() =>
            this.isSubmitReviewConfirmedPerLang(
              lang,
              isSubmitReviewConfirmedNonMainLang
            )
          );
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  isReadyForPublish() {
    // updates the SanctionEntry submitForREview boolean flag - after this it is ready to be published
    // create a servcie to call the backend, pass in sanctionID, return a variable to indicate this field is seet
    const sancId = this.sanctionForm;
    this.sancinputSvc.isReadyForPublish(this.sanctionId, this.lang).subscribe(
      (data) => {
        console.log('invoiked the isReadyForPublish ', data);
      },
      (error) => {
        this.notifyService.showError(error, 'Error');
      }
    );
  }

  cancelEditSubmit() {
    this.isEditMode = false;
  }

  isSubmitReviewConfirmedPerLang(
    lang: string,
    langItem: string
  ): boolean {
    return lang == langItem;
  }

  areAllLangsSubmitReviewConfirmed(): boolean {
    let result = true;
    this.isSubmitReviewConfirmedMp.forEach((value: {}, key: string) => {
      result = result && value['isSubmitReviewConfirmed'];
    });

    return result;
  }

  getApplicableMeasuresValid(): boolean {
    const { value } = this.sanctionForm
      .get('lstReq')
      .get('applicableMeasures');
    this.isApplicableMeasuresValid = value.toString().includes('true');
    return this.isApplicableMeasuresValid;
  }

  onCheckboxChange(e, i) {
    const { value } = this.sanctionForm.get('lstReq').get('applicableMeasures');
    value[i] = e.target ? e.target.checked : e.checked;
    this.isApplicableMeasuresValid = value.toString().includes('true');
  }

  onMemberStatesChange(e) {
    this.mbmrStConfid = e.checked;
  }

  getTranslation(str) {
    return this.translations[this.lowLang][str] || str;
  }

  reviewTranslation() {
    this.makeFormEditable();
    this.sancinputSvc
      .reviewTranslation(this.lang, parseInt(this.sanctionId))
      .subscribe(
        (data) => {
          this.isTranslated = false;
          const comments = `Entry reviewed translation in ${this.lang}`;
          const refNum = (<FormGroup>this.sanctionForm.controls['lstReq'])
            .controls['refNum'].value;
          const pressRelease: any = {
            entryId: parseInt(this.sanctionId),
            pressRelease: this.sanctionForm.value.pressRelease,
            updateType: this.sanctionForm.value.updteType,
            updatedOn: this.sanctionForm.value.listedOn,
            pressReleaseId: '',
            refNum: refNum,
          };

          this.updateStateAndActivityLog(
            this.sanctionForm.value,
            this.sanctionId,
            this.ngxsSanctStatus,
            this.ngxsSanctStatus,
            comments,
            fakeUser.enabled
              ? fakeUser.userName
              : this.adalService.userInfo.userName,
            pressRelease,
            true
          );
          this.getTranslationStatus();
        },
        (error) => {
          this.notifyService.showError(error, 'Error');
        }
      );
  }

  close() {
    let url = 'all-entries';
    if (this.ngxsSanctStatus === 'NEW') {
      url = 'all-entries';
    } else if (this.ngxsSanctStatus === 'PENDING') {
      url = 'pending-entries';
    } else if (this.ngxsSanctStatus === 'ONHOLD') {
      url = 'onhold-entries';
    } else if (this.ngxsSanctStatus === 'ONHOLDEXTENDED') {
      url = 'ext-entries';
    } else if (this.ngxsSanctStatus === 'AMEND') {
      url = 'amended-entries';
    } else if (this.ngxsSanctStatus === 'ACTIVE') {
      url = 'active-entries';
    } else if (this.ngxsSanctStatus === 'REMOVED') {
      url = 'removed-entries';
    } else if (this.ngxsSanctStatus === 'SUBMIT4REVIEW') {
      url = 'submitted-entries';
    } else if (this.ngxsSanctStatus === 'DELISTED') {
      url = 'delisted-entries';
    }
    this.router.navigateByUrl(url);
  }

  getRegimeName() {
    return this.sanctionForm.get('lstReq').get('regime').value.split('--')[1];
  }

  getSelectedMeasures() {
    const { value } = this.sanctionForm
      .get('lstReq')
      .get('applicableMeasures');
    return this.regimeMeas.filter((_, index) => value[index]);
  }

  getSelectedCountries() {
    return this.submittedByDataSrc.data.map((item: any) => item.submittedby);
  }

  getEntryIcon() {
    const entryTypeObj = this.lookupLst$.entryType.find(
      (item) => item[this.lang]['entryTypeName'] === this.recordType
    );

    if (!entryTypeObj) return '';

    const entryType = entryTypeObj['EN']['entryTypeName'];

    if (!entryType) {
      return '';
    } else if (entryType === 'Individual') {
      return 'user';
    } else if (entryType === 'Entity') {
      return 'industry';
    } else if (entryType === 'Aircraft') {
      return 'plane';
    } else if (entryType === 'Vessel') {
      return 'ship';
    }
    return '';
  }
}

export interface DialogData {
  nameType: {};
  name: string;
  title: string;
  order: string;
  script: {};
  isReadOnly: boolean;
}

export interface BiometricDialogData {
  biometricTypes: {};
  title: string;
  bioMType: string;
  bioMVal: string;
  bioMAttch: string;
  bioMNote: string;
  isReadOnly: boolean;
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
  isReadOnly: boolean;
}

export interface PobDialogData {
  street: string;
  city: string;
  title: string;
  stateProv: string;
  zipCde: string;
  locOptions: string;
  note: string;
  region: string;
  lat: number;
  lng: number;
  isReadOnly: boolean;
}

export class RelatedLst {
  name: string;
  refNum: string;
}
