import { Component, Input, OnInit } from '@angular/core';
import { LookupLst } from '../../classes/lookupLst';
import { LookupCollproviderProvider } from '../../services/providers/lookup-collprovider.service';

@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.scss'],
})
export class LookupsComponent implements OnInit {
  workingMainLanguage = 'en';
  translations = {};

  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(private lookupCollprovider: LookupCollproviderProvider) {}

  ngOnInit() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.workingMainLanguage = this.lookupLst$.language.find((item) => item.isWorking).acronym || 'EN';
    this.workingMainLanguage = this.workingMainLanguage.toLowerCase();
    this.translations = this.lookupCollprovider.getTranslations();
  }

  getTranslation(str) {
    return this.translations[this.workingMainLanguage][str] || str;
  }
}
