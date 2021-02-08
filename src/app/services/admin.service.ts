import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { LookupLst } from '../classes/lookupLst';
import { environment } from '../../environments/environment';
import { Countries } from '../models/countriesModel';
import { LookupCollproviderProvider } from '../services/providers/lookup-collprovider.service';
import { Measure } from '../models/measuresModel';
import { Language } from '../models/languageModel';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  lookupLstVal$: LookupLst;
  uri = environment.uri;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': 'my-auth-token'
    }),
  };

  constructor(
    private http: HttpClient,
    private tmpLkup: LookupCollproviderProvider
  ) {
    this.lookupLstVal$ = this.tmpLkup.getLookupColl();
  }

  public loadLookupLst() {
    const lookupLst = this.tmpLkup.getLookupColl();
    return lookupLst;
  }

  getLookupLstRef() {
    return this.lookupLstVal$;
  }

  addEntryTyp(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewEntryTyp';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  updateEntryTyp(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateEntryTyp';
    return this.http
    .post<EntryType>(url, lkEntry, this.httpOptions)
    .pipe();
  }
  deleteEntryTyp(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteEntry';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }
  deleteMeasure(lkEntry: any): Observable<any> {
     
    const url = `${this.uri}` + '/common/deleteMeasure';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  addRegime(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewRegime';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  upDteRegime(updateEntry): Observable<any> {
    const url = `${this.uri}` + '/common/updateRegime';
    return this.http
      .post<any>(url, updateEntry, this.httpOptions)
      .pipe();
  }

  deleteReime(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteRegime';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  updateCountry(updateCountry: Countries): Observable<any> {
    const url = `${this.uri}` + '/common/updateCountry';
    return this.http
      .post<any>(url, updateCountry, this.httpOptions)
      .pipe();
  }

  deleteCountry(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteCountry';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  addMeasure(measure: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewMeasure';
    return this.http
      .post<any>(url, measure, this.httpOptions)
      .pipe();
  }

  updateMeasure(measure: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateMeasure';
    return this.http
      .post<any>(url, measure, this.httpOptions)
      .pipe();
  }

  addLanguage(language: Language): Observable<any> {
    const url = `${this.uri}` + '/common/addNewLanguage';
    return this.http
      .post<Measure>(url, language, this.httpOptions)
      .pipe();
  }

  updateLanguage(updateData: UpdateLanguage): Observable<any> {
    const url = `${this.uri}` + '/common/updateLanguage';
    return this.http
      .post<UpdateLanguage>(url, updateData, this.httpOptions)
      .pipe();
  }

  addTranslation(translation: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewTranslation';
    return this.http
      .post<Measure>(url, translation, this.httpOptions)
      .pipe();
  }

  updateTranslation(updateData: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateTranslation';
    return this.http
      .post<UpdateLanguage>(url, updateData, this.httpOptions)
      .pipe();
  }
  
  addBiometric(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewBiometric';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateBiometric(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateBiometric';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }

  deleteBiometric(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteBiometric';
    return this.http
      .post<EntryType>(url, data, this.httpOptions)
      .pipe();
  }

  addCategoryType(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewCategoryType';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateCategoryType(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateCategoryType';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }

  addFeature(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewFeature';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateFeature(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateFeature';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }

  addGender(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewGender';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateGender(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateGender';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }

  deleteGender(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteGender';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }
  deleteLivingStatus(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteLivingStatus';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  deleteTranslation(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteTranslation';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  deleteBiometricType(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteBiometricType';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  deleteidCategory(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteCategory';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }
  deleteLanguage(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteLanguage';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  deleteFeature(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteFeature';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  deleteIdTypes(lkEntry: any): Observable<any> {
    const url = `${this.uri}` + '/common/deleteIdTypes';
    return this.http
      .post<EntryType>(url, lkEntry, this.httpOptions)
      .pipe();
  }

  addLivingStatus(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewLivingStatus';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateLivingStatus(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateLivingStatus';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }

  addIDType(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/addNewIdType';
    return this.http
      .post<Measure>(url, data, this.httpOptions)
      .pipe();
  }

  updateIDType(data: any): Observable<any> {
    const url = `${this.uri}` + '/common/updateIdType';
    return this.http
      .post<UpdateLanguage>(url, data, this.httpOptions)
      .pipe();
  }
}

export interface EntryType {
  entryPrefix: string;
  entryName: string;
}

export interface UpdateLanguage {
  oldRowData: {};
  modifiedRowData: {};
}
