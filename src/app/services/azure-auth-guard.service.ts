import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Location } from '@angular/common';
import { AdalService } from 'adal-angular4';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const fakeUser = environment.fakeUser;

@Injectable()
export class AzureAuthGuardService implements CanActivate {
  role: string;
  userRoles: any[];
  Roles = [
    'ReadOnly',
    'Officer',
    'Secretary',
    'Translator',
    'Superuser',
    'Administrator',
  ];
  isValidUser: boolean;
  constructor(
    public adalService: AdalService,
    public router: Router,
    public authServ: AuthService,
    public location: Location,
  ) { }

  canActivate(): Observable<boolean> | boolean {
    if (!fakeUser.enabled && !this.adalService.userInfo.authenticated) {
      this.router.navigate(['azure-login']);
      return false;
    } else {
      const userName = fakeUser.enabled
        ? fakeUser.userName
        : this.adalService.userInfo.userName;
      const user: any = { userEmail: userName };

      if (!this.userRoles) {
        return this.authServ.getUser(user).map((data) => {
          let result = false;
          if (
            data[0] != null &&
            data[0].resultErr == null &&
            data[0].isActive
          ) {
            this.userRoles = data[0].roles;
            result = true;
            this.storeRole();
            this.checkAuthorization();
          } else {
            this.removeRole();
            this.router.navigate([`error/notAuthenticated/${userName}`]);
            result = false;
          }
          return result;
        });
      } else {
        this.checkAuthorization();
        return true;
      }
    }
  }

  checkAuthorization() {
    const curUrl = this.location.path();
    const curRole = localStorage.getItem('userRole');
    if (curRole === 'Administrator' && curUrl.includes('home')) {
      this.router.navigate(['lookups']);
    } else if (curRole !== 'Administrator' && curRole !== 'Superuser' && curUrl.includes('lookups')) {
      this.router.navigate(['all-entries']);
    }
  }

  storeRole() {
    if (this.userRoles && this.userRoles.length > 0) {
      this.role = this.userRoles[0];
      if (!localStorage.getItem('userRole')) {
        localStorage.setItem('userRole', this.role);
      }
      localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
    }
  }

  forceStoreRole() {
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'Officer');
    }
    localStorage.setItem('userRoles', JSON.stringify(this.Roles));
  }

  removeRole() {
    localStorage.setItem('userRole', '');
  }

  storeToken(token) {
    localStorage.setItem('jwt-token', token);
  }

  getToken() {
    return localStorage.getItem('jwt-token');
  }

  removeToken() {
    localStorage.removeItem('jwt-token');
  }

  getJwtToken (data) {
    return this.authServ.getJwtToken(data);
  }

  userIsAdministrator() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'Administrator');
    }
    return false;
  }

  userIsSuperuser() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'Superuser');
    }
    return false;
  }

  userIsTranslator() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'Translator');
    }
    return false;
  }

  userIsSecretary() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'Secretary');
    }
    return false;
  }

  userIsOfficer() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'Officer');
    }
    return false;
  }

  userIsReadOnly() {
    const role = localStorage.getItem('userRole');
    if (role && role.length > 0) {
      return this.compareRole(role, 'ReadOnly');
    }
    return false;
  }

  compareRole(userRole, requiredRole) {
    if (!fakeUser.enabled && !localStorage.getItem('jwt-token')) { return false; }

    const userRoleId = this.Roles.indexOf(userRole);
    const requiredRoleId = this.Roles.indexOf(requiredRole);
    if (userRoleId > -1 && userRoleId == requiredRoleId) {
      return true;
    } else {
      return false;
    }
  }
}
