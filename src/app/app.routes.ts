import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NewUserComponent } from './components/user/new-user.component';
import { LookupsComponent } from './components/lookups/lookups.component';
import { LOOKUP_ROUTES } from './components/lookups/lookups.routes';
import { SecurityLookupsComponent } from '../app/components/security-lookups/security-lookups.component';
import { AzureLoginComponent } from './components/core/azure-login/azure-login.component';
import { AzureAuthGuardService } from './services/azure-auth-guard.service';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { SECURITY_LOOKUP_ROUTES } from './components/security-lookups/security-lookups.routes';

const APP_ROUTES: Routes = [
  { path: 'azure-login', component: AzureLoginComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'home/:entryStatus',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'lookups',
    component: LookupsComponent,
    canActivate: [AzureAuthGuardService],
    children: LOOKUP_ROUTES,
  },
  {
    path: 'security',
    component: SecurityLookupsComponent,
    canActivate: [AzureAuthGuardService],
    children: SECURITY_LOOKUP_ROUTES,
  },
  {
    path:
      'user/:id/:refNum/status/:status/isStatusCurrent/:isStatusCurrent',
    canActivate: [AzureAuthGuardService],
    runGuardsAndResolvers: 'always',
    component: NewUserComponent,
  },
  {
    // find particular record for this entry that might have been amended
    path: 'user/:id/amendment/:amendmentCt/amendmentStatus/:amendmentStatus',
    canActivate: [AzureAuthGuardService],
    component: NewUserComponent,
  },
  {
    // find particular record for this entry that might have been amended
    path: 'user/:id/:refNum/:status/:amendmentId',
    canActivate: [AzureAuthGuardService],
    component: NewUserComponent,
  },
  {
    path: 'user/:id/:refNum/:status',
    canActivate: [AzureAuthGuardService],
    runGuardsAndResolvers: 'always',
    component: NewUserComponent,
  },
  {
    path: 'user/:id/:status',
    canActivate: [AzureAuthGuardService],
    runGuardsAndResolvers: 'always',
    component: NewUserComponent,
  },
  {
    path: 'user/:id/superseded/:supersededCt',
    canActivate: [AzureAuthGuardService],
    component: NewUserComponent,
  },
  {
    //TODO - find any records for this user that have been superseded
    path: 'user/:id/superseded',
    canActivate: [AzureAuthGuardService],
    component: NewUserComponent,
  },
  {
    //TODO - find a version history old record
    path: 'user/:id/',
    canActivate: [AzureAuthGuardService],
    component: NewUserComponent,
  },
  {
    path: 'new',
    component: NewUserComponent,
  },
  {
    path: 'removed-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'new-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'pending-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'submitted-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'onhold-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'ext-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'delisted-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'active-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'amended-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'all-entries',
    component: HomeComponent,
    canActivate: [AzureAuthGuardService],
  },
  {
    path: 'error/:errId/:usrId',
    component: GlobalErrorComponent,
  },
  {
    path: 'error',
    component: GlobalErrorComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo:  'all-entries' },
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
