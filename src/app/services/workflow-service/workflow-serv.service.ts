import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkflowServService {
  uriGetAllVersions = environment.uri + '/common/getAllVersions'; // + + ':' + process.env.port;
  uriDetails = environment.uri + '/common/getSanctionsDetails';
  constructor(private _http: HttpClient) {}

  public getAllVersions(
    entryId: String,
    permRefNum: String
  ): Observable<String[]> {
    return this._http.get<String[]>(
      `${this.uriGetAllVersions}/` + entryId + '/' + permRefNum
    );
  }
}
