import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {
  Sanctionintf,
  ActivityLogintf,
  PressReleaseintf,
} from '../models/sanctionintf';

@Injectable({
  providedIn: 'root',
})
export class SanctionInputService {
  uri = environment.uri + '/common/insertNewSanction';
  submitReviewSancUrl = environment.uri + '/common/submitForReview';
  UpdateSuperSedeInfo = environment.uri + '/common/supersedeSiblings';
  insertSanctUri = environment.uri + '/common/insertSanction';
  getStatusAmendmentUri = environment.uri + '/common/getStatusAmendment';
  insertInitSancUri = environment.uri + '/common/insertInitialSanction';
  updateUri = environment.uri + '/common/updateSanction';
  translationMarkUri = environment.uri + '/common/markTranslation';
  translationReviewUri = environment.uri + '/common/reviewTranslation';
  getTranslationStatusUri = environment.uri + '/common/getTranslationStatus';
  postActvtyUri = environment.uri + '/common/updateActivityLog';
  uriRefNumCounter = environment.uri + '/common/getNextRefNumSeq';
  uriUpdtePressRel = environment.uri + '/common/updatePressRelease';
  saveEditedFreeTextUri = environment.uri + '/common/saveEditedFreeText';
  confirmSubmit4ReviewUri = environment.uri + '/common/confirmSubmitForReview';
  isReadyForPublishUri = environment.uri + '/common/isReadyForPublish';

  constructor(private _http: HttpClient) {}

  public submitForReviewOtherLangs(
    overallForm: Sanctionintf
  ): Observable<Response> {
    return this.post1(this.saveEditedFreeTextUri, overallForm);
  }

  public submitForReview(
    lang: string,
    sanctionId: number,
    amendmentId: string
  ): Observable<Response> {
    const submitForReviewData = {
      chosenLang: lang,
      sanctionId: sanctionId,
      amendmentId: null,
    };
    return this._http
      .post(this.submitReviewSancUrl, submitForReviewData)
      .map((response: Response) => {
        return response;
      });
  }

  public insertSanctionForm(overallForm: Sanctionintf): Observable<Response> {
    return this.post1(this.insertSanctUri, overallForm);
  }

  public supersedeSiblings(refNum: string): Observable<Response> {
    return this._http.post(this.UpdateSuperSedeInfo, { refNum }).map((response: Response) => {
      return response;
    });
  }

  public insertInitalSanctionForm(
    overallForm: Sanctionintf
  ): Observable<Response> {
    return this.post1(this.insertInitSancUri, overallForm);
  }

  public confirmSubmitForReview(
    sancId: String,
    lang: String
  ): Observable<Object> {
    return this._http.post(this.confirmSubmit4ReviewUri, {
      sancId: sancId,
      lang: lang,
    });
  }

  public isReadyForPublish(sancId: String, lang: String): Observable<Object> {
    return this._http.post(this.isReadyForPublishUri, {
      sancId: sancId,
      lang: lang,
    });
  }

  public getStatusAmendment(): Observable<Object> {
    return this._http.get(this.getStatusAmendmentUri);
  }

  public post1(url: string, overallForm: Sanctionintf): Observable<Response> {
    const formData: FormData = new FormData();
    formData.append('entryData', JSON.stringify(overallForm));
    const idArr = overallForm.idArr;
    let index = 0;

    for (const id of idArr) {
      const biomMInfArr = id.biometricInf;
      for (const bioM of biomMInfArr) {
        if (bioM['bioMAttch']) {
          const idTab = index;
          const bioMType = bioM['bioMType'];
          let j = 0;

          for (const attchmnt of bioM['bioMAttch']) {
            if (!(attchmnt.filee instanceof Blob)) {
              continue;
            }
            const fileName =
              idTab + '_' + bioMType + '_' + j++ + '_' + attchmnt['filename'];
            formData.append('attch', attchmnt.filee, fileName);
          }
        }
      }
      index++;
    }

    return this._http.post(url, formData).map((response: Response) => {
      return response;
    });
  }

  updateSanctionForm(overallForm: Sanctionintf): Observable<Response> {
    return this.postUpdate(this.updateUri, overallForm);
  }

  public postUpdate(
    url: string,
    overallForm: Sanctionintf
  ): Observable<Response> {
    const formData: FormData = new FormData();

    formData.append('entryData', JSON.stringify(overallForm));
    const idArr = overallForm.idArr;
    let index = 0;

    for (const id of idArr) {
      const biomMInfArr = id.biometricInf;
      for (const bioM of biomMInfArr) {
        if (bioM['bioMAttch']) {
          const idTab = index;
          const bioMType = bioM['bioMType'];
          let j = 0;

          for (const attchmnt of bioM['bioMAttch']) {
            if (!(attchmnt.filee instanceof Blob)) {
              continue;
            }

            const fileName =
              idTab + '_' + bioMType + '_' + j++ + '_' + attchmnt['filename'];
            formData.append('attch', attchmnt.filee, fileName);
          }
        }
      }
      index++;
    }

    return this._http.post(url, formData).map((response: Response) => {
      return response;
    });
  }

  public updatePressRelease(pressRelease: any): Observable<Response> {
    return this._http
      .post(this.uriUpdtePressRel, pressRelease)
      .map((response: Response) => {
        return response;
      });
  }

  public createRetrieveRefCounter(regime: any): Observable<any> {
    return this._http
      .post(this.uriRefNumCounter, regime)
      .map((response: Response) => {
        return response;
      });
  }

  public postUpdateActivityLog(
    activityLog: ActivityLogintf,
    stateMetaDataObj: any,
    pressRelease: PressReleaseintf,
    translate: boolean
  ): Observable<Response> {
    const url = this.postActvtyUri;
    const postUpdteObj = {};
    postUpdteObj['actvtyLg'] = activityLog;
    postUpdteObj['stateMetaDataRef'] = stateMetaDataObj;
    postUpdteObj['pressRelease'] = pressRelease;
    postUpdteObj['translate'] = translate;
    return this._http.post(url, postUpdteObj).map((response: Response) => {
      return response;
    });
  }

  public markAsCompleted(langId: string, idNum: number): Observable<Response> {
    return this._http
      .post(this.translationMarkUri, { langId, idNum })
      .map((response: Response) => {
        return response;
      });
  }

  public reviewTranslation(
    langId: string,
    idNum: number
  ): Observable<Response> {
    return this._http
      .post(this.translationReviewUri, { langId, idNum })
      .map((response: Response) => {
        return response;
      });
  }

  public getTranslationStatus(idNum: number): Observable<Response> {
    return this._http
      .post(this.getTranslationStatusUri, { idNum })
      .map((response: Response) => {
        return response;
      });
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }
}
