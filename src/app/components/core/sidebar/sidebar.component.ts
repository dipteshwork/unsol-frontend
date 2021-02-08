import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AzureAuthGuardService } from '../../../services/azure-auth-guard.service';
import { environment } from '../../../../environments/environment'


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input('index') index: string;
  @Input('appLang') appLang: string;
  @Input('translations') translations: {};
  @Output() changeRateColumn = new EventEmitter<string>();

  environment = environment;
  collapsed = false;
  sidebarIndex = '1';
  entryNavLinks = [
    { path: '/all-entries', name: 'View All', icon: 'fa-eye' },
    { path: '/pending-entries', name: 'Pending', icon: 'fa-clock' },
    {
      path: '/submitted-entries',
      name: 'Submitted for review',
      icon: 'fa-comment-alt',
    },
    { path: '/onhold-entries', name: 'On Hold', icon: 'fa-hand-paper' },
    {
      path: '/active-entries',
      name: 'Published(Active)',
      icon: 'fa-upload',
    },
    { path: '/delisted-entries', name: 'De-listed', icon: 'fa-list' },
    { path: '/removed-entries', name: 'Deleted', icon: 'fa-trash' },
  ];
  lookupNavLinks = [
    { path: '/lookups/entry-types', name: 'Entry Types', icon: 'assets/img/sidebar/lookup/description-24px.png' },
    { path: '/lookups/measures', name: 'Measures', icon: 'assets/img/sidebar/lookup/beach_access-24px.png' },
    { path: '/lookups/regimes', name: 'Regimes', icon: 'assets/img/sidebar/lookup/settings-24px.png' },
    { path: '/lookups/countries', name: 'Countries', icon: 'assets/img/sidebar/lookup/language-24px.png' },
    { path: '/lookups/gender', name: 'Gender', icon: 'assets/img/sidebar/lookup/noun_gender-24px.png' },
    { path: '/lookups/livstatus', name: 'Living Status', icon: 'assets/img/sidebar/lookup/noun_status-24px.png' },
    { path: '/lookups/translations', name: 'Translations', icon: 'assets/img/sidebar/lookup/translate-24px.png' },
    { path: '/lookups/biometric', name: 'Biometric Types', icon: 'assets/img/sidebar/lookup/fingerprint-24px.png' },
    { path: '/lookups/categories', name: 'Categories', icon: 'assets/img/sidebar/lookup/category-24px.png' },
    { path: '/lookups/langs', name: 'Language', icon: 'assets/img/sidebar/lookup/language-24px.png' },
    { path: '/lookups/features', name: 'Features', icon: 'assets/img/sidebar/lookup/featured_play_list-24px.png' },
    { path: '/lookups/idtyps', name: 'Id Types', icon: 'assets/img/sidebar/lookup/perm_identity-24px.png' },
  ];
  securityNavLinks = [
    { path: '/security/users', name: 'Users', icon: 'assets/img/sidebar/security/account_circle-24px.png' },
    { path: '/security/roles', name: 'Roles', icon: 'assets/img/sidebar/security/work_outline-24px.png' },
    { path: '/security/notification', name: 'Notification', icon: 'assets/img/sidebar/security/work_outline-24px.png' },
  ];

  constructor(
    public azureAuthService: AzureAuthGuardService
  ) { }

  ngOnInit() {
    if (!this.userIsSuperuser()) {
      this.entryNavLinks.splice(this.entryNavLinks.findIndex(
        (item) => item.path == '/removed-entries'),
        1);
    }
  }

  onChangeRateColumn(e) {
    this.changeRateColumn.emit(e);
  }

  onChangeItem(e, i): void {
    if (screen.width < 800) {
      this.sidebarIndex = i;
    }
  }

  onChangeCollapse() {
    this.collapsed = !this.collapsed;
    this.onChangeRateColumn(this.collapsed);
  }

  userIsAdministrator(): boolean {
    return this.azureAuthService.userIsAdministrator();
  }

  userIsSuperuser(): boolean {
    return this.azureAuthService.userIsSuperuser();
  }

  userIsTranslator(): boolean {
    return this.azureAuthService.userIsTranslator();
  }

  userIsSecretary(): boolean {
    return this.azureAuthService.userIsSecretary();
  }

  userIsOfficer(): boolean {
    return this.azureAuthService.userIsOfficer();
  }

  userIsReadOnly(): boolean {
    return this.azureAuthService.userIsReadOnly();
  }

  userIsAuthenticated(): boolean {
    if (
      this.azureAuthService.userIsAdministrator() == true ||
      this.azureAuthService.userIsSuperuser() == true ||
      this.azureAuthService.userIsTranslator() == true ||
      this.azureAuthService.userIsSecretary() == true ||
      this.azureAuthService.userIsOfficer() == true ||
      this.azureAuthService.userIsReadOnly() == true
    ) {
      return true;
    } else {
      return false;
    }
  }

  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
