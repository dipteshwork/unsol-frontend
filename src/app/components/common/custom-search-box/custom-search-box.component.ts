import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-custom-search-box',
  templateUrl: './custom-search-box.component.html',
  styleUrls: ['./custom-search-box.component.scss'],
})
export class CustomSearchBoxComponent implements OnInit {
  lang: string;
  translations = {};

  constructor(
    private lookupCollprovider: LookupCollproviderProvider,
    private authServ: AuthService
  ) {
  }

  ngOnInit(): void {
    this.translations = this.lookupCollprovider.getTranslations();
    this.lang = this.authServ.getPreferLang();
  }

  @Output() onFilterFunc = new EventEmitter<string>();
  applyFilter(e) {
    this.onFilterFunc.emit(e);
  }

  getTranslation(str) {
    return this.translations[this.lang.toLowerCase()][str] || str;
  }
}
