import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LookupLst } from '../../../classes/lookupLst';
import { AzureAuthGuardService } from '../../../services/azure-auth-guard.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit, OnChanges {
  @Input('sancStatus') sancStatus: string;
  @Input('isEditMode') isEditMode: Boolean;
  @Input('isFreeTextEditable') isFreeTextEditable: Boolean;
  @Input('isRemoveWrkFlwLinks') isRemoveWrkFlwLinks: Boolean;
  @Input('lang') lang: string;
  @Input('workingMainLanguage') workingMainLanguage: string;
  @Input('isSubmitReviewConfirmed') isSubmitReviewConfirmed: Boolean;
  @Input('areAllSubmitReviewConfirmed') areAllSubmitReviewConfirmed: Boolean;
  @Input('lkupSrv') lookupLst$: LookupLst;
  @Input('translations') translations;
  @Input('isTranslated') isTranslated: Boolean;
  @Input('canBePublished') canBePublished: Boolean;
  @Input('officialLanguages') officialLanguages: string[];
  @Input('isLoading') isLoading: string[];
  appLang: string = 'EN';
  curUser: User;

  constructor(public azureAuthService: AzureAuthGuardService,
    private authServ: AuthService) {}

  ngOnInit() {
    this.areAllLangsSubmitReviewConfirmed();

    this.appLang = this.authServ.getPreferLang().toUpperCase();
    this.curUser = this.authServ.getCurrentUser();
  }

  @Output() childDownloadEvent = new EventEmitter<string>();
  downloadTranslatedFile(download: string) {
    this.childDownloadEvent.emit(download);
  }

  @Output() childPreviewEvent = new EventEmitter<string>();
  preview() {
    this.childPreviewEvent.emit('preview');
  }

  @Output() childOpenWrkFlwVersHistDialogEvent = new EventEmitter<string>();
  openWrkFlwVersHistDialog() {
    this.childOpenWrkFlwVersHistDialogEvent.emit();
  }

  @Output() childSaveEditedFreeTextEvent = new EventEmitter();
  saveEditedFreeText() {
    this.childSaveEditedFreeTextEvent.emit();
  }

  @Output() childDeleteSanctionEvent = new EventEmitter<string>();
  deleteSanction() {
    this.childDeleteSanctionEvent.emit();
  }

  @Output() confirmSubmit4ReviewEvent = new EventEmitter<string>();
  confirmSubmit4Review() {
    this.confirmSubmit4ReviewEvent.emit();
  }

  @Output() markAsCompletedEvent = new EventEmitter<string>();
  markAsCompleted() {
    this.markAsCompletedEvent.emit();
  }

  @Output() openOnholdDialogEvent = new EventEmitter<string>();
  openOnholdDialog() {
    this.openOnholdDialogEvent.emit();
  }

  @Output() makeFormEditableEvent = new EventEmitter();
  makeFormEditable() {
    this.makeFormEditableEvent.emit();
  }

  @Output() makeFormNonEditableEvent = new EventEmitter<string>();
  makeFormNonEditable(str: string) {
    this.makeFormNonEditableEvent.emit(str);
  }

  @Output() areAllLangsSubmitReviewConfirmedEvent = new EventEmitter();
  areAllLangsSubmitReviewConfirmed() {
    this.areAllLangsSubmitReviewConfirmedEvent.emit();
  }

  @Output() submitForReviewEvent = new EventEmitter<string>();
  submitReview() {
    this.submitForReviewEvent.emit('test');
  }

  @Output() publishEvent = new EventEmitter();
  activate() {
    this.publishEvent.emit();
  }

  @Output() amendEvent = new EventEmitter();
  reviewAmend() {
    this.amendEvent.emit();
  }

  @Output() reviewEvent = new EventEmitter();
  review() {
    this.reviewEvent.emit();
  }

  @Output() delistEvent = new EventEmitter();
  delist() {
    this.delistEvent.emit();
  }

  get userIsAdministrator(): boolean {
    return this.azureAuthService.userIsAdministrator();
  }

  get userIsSuperuser(): boolean {
    return this.azureAuthService.userIsSuperuser();
  }

  get userIsTranslator(): boolean {
    return this.azureAuthService.userIsTranslator();
  }

  get userIsSecretary(): boolean {
    return this.azureAuthService.userIsSecretary();
  }

  get userIsOfficer(): boolean {
    return this.azureAuthService.userIsOfficer();
  }

  get userIsReadOnly(): boolean {
    return this.azureAuthService.userIsReadOnly();
  }

  get userCanTranslate(): boolean {
    return this.userIsTranslator;
    // return this.userIsTranslator && this.curUser.langs && this.curUser.langs.indexOf(this.lang) >= 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    const changeLog = [];
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      changeLog.push(
        `${propName}: currentValue = ${cur}, previousValue = ${prev}`
      );
    }
  }

  @Output() reviewTranslationEvent = new EventEmitter();
  reviewTranslation() {
    this.reviewTranslationEvent.emit();
  }

  getTranslation(str) {
    return (
      this.translations[this.appLang.toLowerCase()][str] || str
    );
  }
}
