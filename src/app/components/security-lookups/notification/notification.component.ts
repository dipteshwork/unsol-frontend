import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  translations: {};
  lang = 'en';
  activeTab = 0;

  constructor(
    private lookupCollprovider: LookupCollproviderProvider,
    private router: Router,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.translations = this.lookupCollprovider.getTranslations();
    this.lang = this.authServ.getPreferLang();
    this.lang = this.lang.toLowerCase();
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()][str] || str;
  }

  handleNavigation(url) {
    this.router.navigateByUrl(url);
  }
}
