import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdalService } from 'adal-angular4';
import { Language } from 'src/app/models/languageModel';
import { AzureAuthGuardService } from '../../../services/azure-auth-guard.service';
import { environment } from '../../../../environments/environment';

const fakeUser = environment.fakeUser;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input('index') index: string;
  @Input('langArr') langArr: Language[];
  @Input('appLang') appLang: string;
  @Input('translations') translations: {};
  @Input('isAuthenticated') isAuthenticated: boolean;

  curLang: string;
  dRole = '';
  roles: any[];
  fakeUser = fakeUser;

  constructor(
    public adalService: AdalService,
    private translate: TranslateService,
    public azureAuthService: AzureAuthGuardService
  ) {}

  ngOnInit() {
    this.curLang = this.appLang.toUpperCase();
    this.roles = [
      'ReadOnly',
      'Officer',
      'Secretary',
      'Translator',
      'Superuser',
      'Administrator',
    ];
    this.dRole = localStorage.getItem('userRole');
  }

  @Output() changeIndex = new EventEmitter<string>();
  onChangeItem(e, i) {
    this.changeIndex.emit(i);
  }

  login() {
    this.adalService.login();
  }

  logout() {
    this.adalService.logOut();
  }

  switchLang(lang: Language) {
    this.curLang = lang.acronym;
    this.translate.use(this.curLang.toLowerCase());
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

  get userIsAuthenticated(): boolean {
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
    return (this.translations && this.translations[this.appLang] && this.translations[this.appLang][str]) || str;
  }
}
