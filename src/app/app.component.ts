import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AdalService } from 'adal-angular4';
import { environment } from '../environments/environment';
import { AddSanctionMessageService } from './services/sidebar-events/add-sanction.service';
import { AzureAuthGuardService } from './services/azure-auth-guard.service';
import { LookupCollproviderProvider } from './services/providers/lookup-collprovider.service';
import { AuthService } from './services/auth.service';
import { LookupLst } from './classes/lookupLst';
import { Language } from './models/languageModel';

const fakeUser = environment.fakeUser;
const sendTokenToBackend = environment.sendTokenToBackend;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  isAuthenticated: boolean;
  isAuthenticating = true;
  isAuthorized = true;
  appLang = 'en';
  langArr: Language[];
  sidebarIndex =
    localStorage.getItem('userRole') == 'Administrator' ? '2' : '1';
  translations = {};
  collapsed = false;
  azureInfo: any;
  lookupLst$: LookupLst = null;

  @Output() onFilter: EventEmitter<string> = new EventEmitter();

  constructor(
    private _messageService: AddSanctionMessageService,
    private adalService: AdalService,
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService,
    private ref: ChangeDetectorRef,
    public azureAuthService: AzureAuthGuardService,
    public translate: TranslateService,
    public location: Location,
    public router: Router
  ) {
    if (fakeUser.enabled) {
      this.isAuthenticating = false;
      this.initializeApp();
    } else {
      adalService.init(environment.adalConfig);
      adalService.handleWindowCallback();
    }
  }

  ngOnInit() {
    if (!fakeUser.enabled) {
      setTimeout(() => {
        this.azureInfo = this.adalService.userInfo;
        const azureToken = this.azureInfo['token'];
        if (this.isAuthenticated || !this.azureInfo.authenticated) {
          this.isAuthenticating = false;
          return;
        }

        if (sendTokenToBackend) {
          if (azureToken && azureToken.length > 0) {
            this.azureAuthService
              .getJwtToken({
                email: this.azureInfo['profile']['email'],
                token: azureToken,
              })
              .then((data) => {
                this.azureAuthService.storeToken(azureToken);
                this.azureAuthService.storeRole();
                this.isAuthenticated = true;
                this.isAuthenticating = false;
                this.isActive(this.azureInfo.userName);
                this.initializeApp();
              })
              .catch((err) => {
                this.azureAuthService.removeRole();
                this.isAuthenticated = false;
                this.isAuthenticating = false;
              });
          }
        } else {
          this.isAuthenticated = true;
          this.isAuthenticating = false;
          this.azureAuthService.storeToken(azureToken);
          this.isActive(this.azureInfo.userName);
          this.initializeApp();
        }
      }, 500);
    } else {
      this.azureAuthService.forceStoreRole();
      this.isAuthenticated = true;
      this.isAuthenticating = false;
      this.isActive(this.azureInfo.userName);
    }
  }

  initializeApp() {
    this.lookupCollprovider.load().then((data) => {
      this.lookupLst$ = this.lookupCollprovider.getLookupColl();
      this.langArr = this.lookupLst$.language;
      this.translations = this.lookupCollprovider.getTranslations();
      this.ref.detectChanges();
      this.checkAuthorization();
    });

    this.authServ.getRoles().subscribe((roleData) => {
    });

    this.authServ.getUsers().then((data: any[]) => {
      const curUser = data.find((item) => item.userEmail === (fakeUser.enabled ? fakeUser.userName : this.adalService.userInfo.userName));
      this.appLang = (curUser.preferLanguage || 'EN').toLowerCase();
      this.authServ.setPreferLang(this.appLang);
      this.authServ.setCurrentUser(curUser);
      this.ref.detectChanges();
    });
  }

  checkAuthorization() {
    const curRole = localStorage.getItem('userRole');
    if (this.location.path() === '/azure-login') {
      var curUrl: string | string[];
      curUrl = 'lookups';
    }
    if (curRole) {
      if (curRole === 'Administrator') {
        curUrl = this.location.path();
        if (curUrl.includes('security')) {
          this.sidebarIndex = '3';
        } else {
          this.sidebarIndex = '2';
          if (!curUrl.includes('security')) {
            this.router.navigate([curUrl]);
          }
        }
      } else {
        this.sidebarIndex = '1';
        const curUrl = this.location.path();
      }
    } else {
      console.log('no role');
    }
    this.router.navigate([curUrl]);
  }

  isActive(userName: string) {
    this.authServ.getUsers().then(data => {
      // @ts-ignore
      const user = data.find(item => item.userEmail === userName);
      if (!user) {
        this.isAuthorized = false;
      } else {
        this.isAuthorized = true;
      }
    });
  }

  onChangeIndex(i: string) {
    this.sidebarIndex = i;
  }

  onChangeRageColumn(col: any) {
    this.collapsed = col;
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

  addMewSanction() {
    this.clickFilter();
  }

  clickFilter(): void {
    this._messageService.filter('AddNewSanction');
  }

  onChangeItem(e, i): void {
    if (screen.width < 800) {
      this.sidebarIndex = i;
    }
  }

  userIsAuthenticated(): boolean {
    if (
      this.azureAuthService.getToken() &&
      (this.azureAuthService.userIsAdministrator() == true ||
        this.azureAuthService.userIsSuperuser() == true ||
        this.azureAuthService.userIsTranslator() == true ||
        this.azureAuthService.userIsSecretary() == true ||
        this.azureAuthService.userIsOfficer() == true ||
        this.azureAuthService.userIsReadOnly() == true)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
