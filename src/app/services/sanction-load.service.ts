import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { SanctionInputEntry } from '../classes/sanction-input-class';


@Injectable({
  providedIn: 'root',
})
export class SanctionLoadService {
  uri = environment.uri + '/common/getSanctionsList';
  uriDetails = environment.uri + '/common/getSanctionsDetails';
  uri_FindByRefNum = environment.uri + '/common/findByRefNum';
  uriAttchments = environment.uri + '/common/retrieveAttachments';

  constructor(private _http: HttpClient) {}

  public loadSanction(
    langId: string,
    entryStatus: string,
    filterValue?: string
  ): Observable<SanctionInputEntry[]> {
    return this._http.get<SanctionInputEntry[]>(
      filterValue ? `${this.uri}/` + langId + '/' + entryStatus + '/' + filterValue : `${this.uri}/` + langId + '/' + entryStatus
    );
  }

  public loadSanctionDetails(
    langId: string,
    refNum: string,
    idNum: number,
    isStatusCurrent: boolean,
    queryStatus: string,
    amendCt: number,
    amendmentStatus: string,
    supersededCt: number,
    amendmentId: string
  ): Observable<SanctionInputEntry> {
    if (amendCt > 0) {
      return this._http.get<SanctionInputEntry>(
        `${this.uriDetails}/` +
          langId +
          '/' +
          idNum +
          '/amendment/' +
          amendCt +
          '/amendmentStatus/' +
          amendmentStatus
      );
    } else if (supersededCt > 0) {
      return this._http.get<SanctionInputEntry>(
        `${this.uriDetails}/` + langId + '/' + idNum + '/' + supersededCt
      );
    } else if (amendmentId) {
      return this._http.get<SanctionInputEntry>(
        `${this.uriDetails}/` +
          langId +
          '/' +
          idNum +
          '/status/' +
          queryStatus +
          '/amendmentId/' +
          amendmentId
      );
    } else if (!isStatusCurrent) {
      return this._http.get<SanctionInputEntry>(
        `${this.uriDetails}/` +
          langId +
          '/' +
          idNum +
          '/status/' +
          queryStatus +
          '/isStatusCurrent/' +
          isStatusCurrent
      );
    } else {
      return this._http.get<SanctionInputEntry>(
        `${this.uriDetails}/` +
          langId +
          '/' +
          refNum +
          '/' +
          idNum +
          '/' +
          queryStatus
      );
    }
  }

  public findEntryByRefNum(refNum: String): Observable<RelatedLst[]> {
    return this._http.get<RelatedLst[]>(`${this.uri_FindByRefNum}/` + refNum);
  }

  public getJSONs(idNums: number[]): Observable<any> {
    const url = `${environment.uri}/common/getJSONSanctionDocs`;
    return this._http.post(url, idNums, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  // retrieve the consolidated XML after child process executes exteranl program
  public getConsolidatedXML(
    idNums: number[],
    status,
    lang,
    reportType
  ): Observable<any> {
    let idNumstr = null;
    if (idNums.length > 0) {
      idNumstr = idNums.join();
      return this._http.get(
        `${environment.uri}/common/downloadFile?state=${status}&lang=${lang}&ids=${idNumstr}&reportType=${reportType}`,
        { responseType: 'blob' }
      );
    } else {
      return this._http.get(
        `${environment.uri}/common/downloadFile?state=${status}&lang=${lang}&reportType=${reportType}`,
        { responseType: 'blob' }
      );
    }
  }

  public downloadBiomAttchmnts(fileIds: string[]): Observable<any> {
    const params = new HttpParams();
    fileIds = fileIds.filter(function( element ) {
      return element !== undefined;
    });
    fileIds.map((fileId) => {
      if (fileId !== undefined){
        params.append('fileId', fileId);
      }
    });
    return this._http.get(this.uriAttchments, {
      responseType: 'blob',
      params: { fileIds },
    });
  }
}

export class User {
  position: number;
  firstName: string;
  lastName: string;
  email: string;
}

export class SanctionsEntry {
  refNum: string;
  idNum: string;
  recordType: string;
  name: string;
  country: string;
  sanctionType: string;
  submittedOn: string;
  region: string;
  status: string;
  dob: string;
  pob: string;
}

export class RelatedLst {
  name: string;
  refNum: string;
}
