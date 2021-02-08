// import '../polyfills';
import 'hammerjs';

import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouterModule } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { APP_ROUTING } from './app.routes';
import { AppComponent } from './app.component';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { SanctionInputService } from './services/sanction-input.service';
import { SanctionLoadService } from './services/sanction-load.service';
import { NotificationService } from './services/alert/notification.service';
import { LookupCollproviderProvider } from './services/providers/lookup-collprovider.service';
import { CustomMaterialModule } from './modules/custom-module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  MatBadgeModule,
  MatBottomSheetModule,
  MatDividerModule,
  MatSortModule,
  MatTreeModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/core/header/header.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { LookupsComponent } from './components/lookups/lookups.component';
import { MeasuresLkComponent } from './components/lookups/measures-lk/measures-lk.component';
import { NewUserComponent } from './components/user/new-user.component';

import { EntryTypesLkComponent } from './components/lookups/entry-types-lk/entry-types-lk.component';
import { RegimesLkComponent } from './components/lookups/regimes-lk/regimes-lk.component';
import { CountriesLkComponent } from './components/lookups/countries-lk/countries-lk.component';

import { AddNameDialogComponent } from './components/dialog/identity/add-name-dialog/add-name-dialog.component';
import { AddFeatureDialogComponent } from './components/dialog/identity/add-feature-dialog/add-feature-dialog.component';
import { AddDocumentDialogComponent } from './components/dialog/identity/add-document-dialog/add-document-dialog.component';
import { AddAddressDialogComponent } from './components/dialog/identity/add-address-dialog/add-address-dialog.component';
import { AddPobDialogComponent } from './components/dialog/identity/add-pob-dialog/add-pob-dialog.component';
import {
  AddDobDialogComponent,
  CustomDateFormatYYYY,
  CustomDateFormatMMYYYY,
} from './components/dialog/identity/add-dob-dialog/add-dob-dialog.component';
import { BiometricDialogComponent } from './components/dialog/identity/biometric-dialog/biometric-dialog.component';
import { NewEntryDialogComponent } from './components/dialog/action/new-entry-dialog/new-entry-dialog.component';

import { IdentityComponent } from './components/identity/identity.component';
import { EditMeasuresDialogComponent } from './components/dialog/lookups/edit-measures-dialog/edit-measures-dialog.component';
import { EditRegimeMeasuresDialogComponent } from './components/dialog/lookups/edit-regimes-dialog/edit-regimes-dialog.component';
import { EditCountriesDialogComponent } from './components/dialog/lookups/edit-countries-dialog/edit-countries-dialog.component';
import { StatusRemovedDialogComponent } from './components/dialog/action/status-removed-dialog/status-removed-dialog.component';
import { StatusDelistedDialogComponent } from './components/dialog/action/status-delisted-dialog/status-delisted-dialog.component';
import { PressReleaseDialogComponent } from './components/dialog/listingReq/press-release-dialog/press-release-dialog.component';
import { AdalService, AdalGuard } from 'adal-angular4';
import { AzureAuthGuardService } from './services/azure-auth-guard.service';
import { AzureLoginComponent } from './components/core/azure-login/azure-login.component';
import { AzureUserBoxComponent } from './components/core/header/azure-user-box/azure-user-box.component';
import { SidebarComponent } from './components/core/sidebar/sidebar.component';
import { AuthDialogComponent } from './components/dialog/auth-dialog/auth-dialog.component';
import { DialogService } from './services/dialog.service';
import { SancEntryTypesDialogComponent } from './components/dialog/lookups/sanc-entry-types-dialog/sanc-entry-types-dialog.component';
import { Submitted4ReviewDialogComponent } from './components/dialog/action/submitted4-review-dialog/submitted4-review-dialog.component';
import { PublishDialogComponent } from './components/dialog/action/publish-dialog/publish-dialog.component';
import { PublishWarningDialogComponent } from './components/dialog/action/publish-warning-dialog/publish-warning-dialog.component';
import { ReviewDialogComponent } from './components/dialog/action/review-dialog/review-dialog.component';
import { ActivateDialogComponent } from './components/dialog/action/activate-dialog/activate-dialog.component';
import { RemoveDialogComponent } from './components/dialog/action/remove-dialog/remove-dialog.component';
import { OnHoldDialogComponent } from './components/dialog/entry/on-hold-dialog/on-hold-dialog.component';
import { OnExtHoldDialogComponent } from './components/dialog/entry/on-ext-hold-dialog/on-ext-hold-dialog.component';
import { GenderLkComponent } from './components/lookups/gender-lk/gender-lk.component';
import { LivingstatLkComponent } from './components/lookups/livingstat-lk/livingstat-lk.component';
import { TranslationsLkComponent } from './components/lookups/translations-lk/translations-lk.component';
import { BiometricLkComponent } from './components/lookups/biometric-lk/biometric-lk.component';
import { CategoriesLkComponent } from './components/lookups/categories-lk/categories-lk.component';
import { LangsLkComponent } from './components/lookups/langs-lk/langs-lk.component';
import { FeaturesLkComponent } from './components/lookups/features-lk/features-lk.component';
import { IdtypsLkComponent } from './components/lookups/idtyps-lk/idtyps-lk.component';
import { SubmittedByDialogComponent } from './components/dialog/entry/submitted-by-dialog/submitted-by-dialog.component';
import { DesigDialogComponent } from './components/dialog/identity/desig-dialog/desig-dialog.component';
import { TitleDialogComponent } from './components/dialog/identity/title-dialog/title-dialog.component';
import { NationalityDialogComponent } from './components/dialog/identity/nationality-dialog/nationality-dialog.component';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { RolesLkComponent } from './components/security-lookups/roles-lk/roles-lk.component';
import { UsersLkComponent } from './components/security-lookups/users-lk/users-lk.component';
import { UserDialogComponent } from './components/dialog/security-lookups/user-dialog/user-dialog.component';
import { RoleDialogComponent } from './components/dialog/security-lookups/role-dialog/role-dialog.component';
import { ReceiverDialogComponent } from './components/dialog/security-lookups/receiver-dialog/receiver-dialog.component';
import { NotiEmailDialogComponent } from './components/dialog/security-lookups/noti-email-dialog/noti-email-dialog.component';
import { SecurityLookupsComponent } from './components/security-lookups/security-lookups.component';
import { ReceiverSettingComponent } from './components/security-lookups/notification/receiver-setting/receiver-setting.component';
import { EmailSettingComponent } from './components/security-lookups/notification/email-setting/email-setting.component';
import { XmlJsonReportsComponent } from './components/dialog/report/xml-json-reports/xml-json-reports.component';
import { IdTypesDialogComponent } from './components/dialog/lookups/id-types-dialog/id-types-dialog.component';
import { FeaturesDialogComponent } from './components/dialog/lookups/features-dialog/features-dialog.component';
import { LanguagesDialogComponent } from './components/dialog/lookups/languages-dialog/languages-dialog.component';
import { CategoriesDialogComponent } from './components/dialog/lookups/categories-dialog/categories-dialog.component';
import { TranslationsDialogComponent } from './components/dialog/lookups/translations-dialog/translations-dialog.component';
import { LivingStatusDialogComponent } from './components/dialog/lookups/living-status-dialog/living-status-dialog.component';
import { GenderDialogComponent } from './components/dialog/lookups/gender-dialog/gender-dialog.component';
import { BiometricTypeDialogComponent } from './components/dialog/lookups/biometric-type-dialog/biometric-type-dialog.component';
import { NavigationBarComponent } from './components/core/navigation-bar/navigation-bar.component';
import { CustomSearchBoxComponent } from './components/common/custom-search-box/custom-search-box.component';
import { ModalHeaderComponent } from './components/common/modal-header/modal-header.component';
import { NotificationComponent } from './components/security-lookups/notification/notification.component';
import { UserDeleteDialogComponent } from './components/dialog/security-lookups/user-delete-dialog/user-delete-dialog.component';
import { SecurityLookupsDeleteDialogComponent } from './components/dialog/security-lookups/delete-dialog/delete-dialog.component';
import { WarningDialogComponent } from './components/dialog/entry/warning-dialog/warning-dialog.component';
import { LanguageBarComponent } from './components/common/language-bar/language-bar.component';
import { WorkflowVersionsComponent } from './components/dialog/entry/workflow-versions/workflow-versions.component';
import { ConfirmDialogComponent } from './components/dialog/entry/confirm-dialog/confirm-dialog.component';
import { AmendDialogComponent } from './components/dialog/action/amend-dialog/amend-dialog.component';
import { BiomatricTypeComponent } from './components/dialog/entry/delete-general-component/delete-general.component';
import {EmailNotificationService} from './services/email-notification.service';


@NgModule({
  exports: [
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    CustomMaterialModule,
    RouterModule,
  ],

  declarations: [
    HomeComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LookupsComponent,
    NewUserComponent,
    MeasuresLkComponent,
    EntryTypesLkComponent,
    RegimesLkComponent,
    CountriesLkComponent,
    AddNameDialogComponent,
    AddFeatureDialogComponent,
    AddDocumentDialogComponent,
    AddAddressDialogComponent,
    AddPobDialogComponent,
    AddDobDialogComponent,
    CustomDateFormatYYYY,
    CustomDateFormatMMYYYY,
    BiometricDialogComponent,
    NewEntryDialogComponent,
    IdentityComponent,
    EditMeasuresDialogComponent,
    EditRegimeMeasuresDialogComponent,
    EditCountriesDialogComponent,
    StatusRemovedDialogComponent,
    StatusDelistedDialogComponent,
    PressReleaseDialogComponent,
    AzureLoginComponent,
    AzureUserBoxComponent,
    SidebarComponent,
    AuthDialogComponent,
    SancEntryTypesDialogComponent,
    Submitted4ReviewDialogComponent,
    PublishDialogComponent,
    PublishWarningDialogComponent,
    ReviewDialogComponent,
    ActivateDialogComponent,
    RemoveDialogComponent,
    OnHoldDialogComponent,
    OnExtHoldDialogComponent,
    GenderLkComponent,
    LivingstatLkComponent,
    TranslationsLkComponent,
    BiometricLkComponent,
    CategoriesLkComponent,
    LangsLkComponent,
    FeaturesLkComponent,
    IdtypsLkComponent,
    SubmittedByDialogComponent,
    DesigDialogComponent,
    TitleDialogComponent,
    NationalityDialogComponent,
    GlobalErrorComponent,
    RolesLkComponent,
    UsersLkComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    SecurityLookupsDeleteDialogComponent,
    WarningDialogComponent,
    RoleDialogComponent,
    ReceiverDialogComponent,
    NotiEmailDialogComponent,
    SecurityLookupsComponent,
    ReceiverSettingComponent,
    EmailSettingComponent,
    NotificationComponent,
    XmlJsonReportsComponent,
    IdTypesDialogComponent,
    FeaturesDialogComponent,
    LanguagesDialogComponent,
    CategoriesDialogComponent,
    TranslationsDialogComponent,
    LivingStatusDialogComponent,
    GenderDialogComponent,
    BiometricTypeDialogComponent,
    NavigationBarComponent,
    CustomSearchBoxComponent,
    ModalHeaderComponent,
    LanguageBarComponent,
    WorkflowVersionsComponent,
    ConfirmDialogComponent,
    AmendDialogComponent,
    BiomatricTypeComponent,
  ],

  imports: [
    RxReactiveFormsModule,
    NgbTypeaheadModule,
    BrowserModule,
    APP_ROUTING,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    SlimLoadingBarModule,
    HttpClientModule,
    CustomMaterialModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatMenuModule,
    RouterModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],

  entryComponents: [
    AddNameDialogComponent,
    AddFeatureDialogComponent,
    AddDocumentDialogComponent,
    BiometricDialogComponent,
    AddDobDialogComponent,
    AddAddressDialogComponent,
    NewEntryDialogComponent,
    EditRegimeMeasuresDialogComponent,
    AddPobDialogComponent,
    IdentityComponent,
    EditMeasuresDialogComponent,
    EditCountriesDialogComponent,
    StatusRemovedDialogComponent,
    StatusDelistedDialogComponent,
    PressReleaseDialogComponent,
    Submitted4ReviewDialogComponent,
    AuthDialogComponent,
    SancEntryTypesDialogComponent,
    PublishDialogComponent,
    PublishWarningDialogComponent,
    ReviewDialogComponent,
    ActivateDialogComponent,
    RemoveDialogComponent,
    OnHoldDialogComponent,
    OnExtHoldDialogComponent,
    SubmittedByDialogComponent,
    DesigDialogComponent,
    TitleDialogComponent,
    NationalityDialogComponent,
    RoleDialogComponent,
    NotiEmailDialogComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    SecurityLookupsDeleteDialogComponent,
    WarningDialogComponent,
    ReceiverDialogComponent,
    XmlJsonReportsComponent,
    IdTypesDialogComponent,
    FeaturesDialogComponent,
    LanguagesDialogComponent,
    BiometricTypeDialogComponent,
    CategoriesDialogComponent,
    TranslationsDialogComponent,
    LivingStatusDialogComponent,
    GenderDialogComponent,
    CustomSearchBoxComponent,
    ModalHeaderComponent,
    LanguageBarComponent,
    WorkflowVersionsComponent,
    ConfirmDialogComponent,
    AmendDialogComponent,
    BiomatricTypeComponent,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LookupCollproviderProvider,
    AdminService,
    AuthService,
    SanctionInputService,
    SanctionLoadService,
    AdalService,
    AdalGuard,
    AzureAuthGuardService,
    DialogService,
    NotificationService,
    EmailNotificationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
