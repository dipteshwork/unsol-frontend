import { Routes } from '@angular/router';
import { UsersLkComponent } from './users-lk/users-lk.component';
import { RolesLkComponent } from './roles-lk/roles-lk.component';
import { ReceiverSettingComponent } from './notification/receiver-setting/receiver-setting.component';
import { EmailSettingComponent } from './notification/email-setting/email-setting.component';
import { NotificationComponent } from './notification/notification.component';

export const SECURITY_LOOKUP_ROUTES: Routes = [
  { path: 'users', component: UsersLkComponent },
  { path: 'roles', component: RolesLkComponent },
  {
    path: 'notification',
    component: NotificationComponent,
    children: [
      { path: 'email-setting', component: EmailSettingComponent },
      { path: 'receiver-setting', component: ReceiverSettingComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'email-setting' },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'users' },
];
