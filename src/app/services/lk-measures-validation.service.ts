import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LkMeasuresValidationService {
  measureSrchURI = 'api/getMeasuresLst';
  constructor(private http: HttpClient) {}

  checkMeasureNotTaken(measure: Observable<string>) {
    return measure
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((meas) => this.searchEntries(meas, 'EN'));
  }

  searchEntries(meas: string, langPrefix: string) {
    console.log('now about to call the backend searchEntries ');
    return this.http
      .get(this.measureSrchURI + '/' + langPrefix + '/' + meas)
      .map((res) => res);
  }
}
