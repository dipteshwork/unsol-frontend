import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LookupLst } from '../../classes/lookupLst';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupCollproviderProvider {
  lookupColl: any = null;
  lookupLst: LookupLst;
  uri = environment.uri;
  defaultLangPrefix = 'EN';

  constructor(private httpClient: HttpClient) {}

  public getLookupColl(): any {
    return this.lookupColl;
  }

  public getOfficialLanguages(): any {
    return this.lookupColl.language
      .filter((item) => item.isOfficial)
      .sort((a, b) => (a.acronym < b.acronym ? -1 : 1))
      .map((item) => item.acronym);
  }

  public getNonOfficialLanguages(): any {
    return this.lookupColl.language
      .filter((item) => !item.isOfficial)
      .sort((a, b) => (a.acronym < b.acronym ? -1 : 1))
      .map((item) => item.acronym);
  }

  public getTranslations(): any {
    // en, fr, ch, ar, ...
    const translationArr = {};
    const translationLookups = this.lookupColl.translations.translation;
    for (const item of translationLookups as any) {
      for (const lang of Object.keys(item)) {
        if (!translationArr[lang]) {
          translationArr[lang] = {};
        }
        translationArr[lang][item.en] = item[lang];
      }
    }
    return translationArr;
  }

  public getEntryStatus(lang: string, status: string): any {
    return this.lookupColl.entryStatus.find((item) => item[lang] == status);
  }

  public load(langPrefix: string = this.defaultLangPrefix, filterValue?: string, filterField?: string) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(filterValue ? `${this.uri}` + '/common/getLookupList/' + langPrefix + '/' + filterValue + '/' + filterField : `${this.uri}` + '/common/getLookupList/' + langPrefix)
        .subscribe((response) => {
          this.lookupColl = response[0];
          resolve(true);
        });
    });
  }
}
