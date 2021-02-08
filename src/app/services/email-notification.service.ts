import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';

import { NotificationEmail } from '../models/email-notification/notificationModel';
import { Receiver } from '../models/email-notification/receiverModel';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
@Injectable()
export class EmailNotificationService {
  uri = environment.uri;
  emailNoti: [NotificationEmail];

  constructor(private http: HttpClient) {}

  getNotiEmail(filterValue?) {
    return this.http.get<any>(filterValue ? this.uri + '/user/security/notification/getEmail' + '/' + filterValue : this.uri + '/user/security/notification/getEmail');
  }

  addNotiEmail(emailNoti: NotificationEmail) {
    return this.http.post<NotificationEmail>(this.uri + '/user/security/notification/insertEmail', emailNoti);
  }

  updateNotiEmail(data: any) {
     return this.http.post<any>(this.uri + '/user/security/notification/updateEmail', data);
  }

  deleteNotiEmail(data: any) {
    return this.http.post<any>(this.uri + '/user/security/notification/deleteEmail', data);
  }

  getReceivers(filterValue?) {
    return this.http.get<any>(filterValue ? this.uri + '/user/security/notification/getReceivers' + '/' + filterValue : this.uri + '/user/security/notification/getReceivers');
  }

  addReceiver(receiver: Receiver) {
    return this.http.post<Receiver>(this.uri + '/user/security/notification/insertReceiver', receiver);
  }

  updateReceiver(data: any) {
     return this.http.post<any>(this.uri + '/user/security/notification/updateReceiver', data);
  }

  deleteReceiver(data: any) {
    return this.http.post<any>(this.uri + '/user/security/notification/deleteReceiver', data);
  }
}
