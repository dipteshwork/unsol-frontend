import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(public dialogService: DialogService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let clonad,
      headers = new HttpHeaders();
    if (
      'adal.token.keys' in localStorage &&
      localStorage['adal.token.keys'] !== ''
    ) {
      const audience = localStorage.getItem('adal.token.keys').split('|')[0];
      const accessToken = localStorage.getItem(
        'adal.access.token.key' + audience
      );
      if (accessToken) {
        headers = new HttpHeaders({ Authorization: 'Bearer ' + accessToken });
      }
    }
    clonad = req.clone({ headers });
    return next.handle(clonad).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error.errorType ? error.error.errorType : '',
          status: error.status,
        };

        return throwError(error);
      })
    );
  }
}
