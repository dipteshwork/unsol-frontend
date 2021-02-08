import { AdalService } from 'adal-angular4';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const fakeUser = environment.fakeUser;

@Component({
  selector: 'app-azure-user-box',
  templateUrl: './azure-user-box.component.html',
  styleUrls: ['./azure-user-box.component.scss'],
})
export class AzureUserBoxComponent implements OnInit {
  isAuthenticated: boolean;
  userRolesArr: any[];
  dRole = '';

  constructor(
    private adalService: AdalService,
    private authServ: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.userRolesArr = JSON.parse(localStorage.getItem('userRoles'));
    this.dRole = localStorage.getItem('userRole');

    !this.userRolesArr &&
      this.authServ.getRoles().subscribe((roleData) => {
        this.userRolesArr = roleData.map((item) => item.roleName);
        this.dRole = this.userRolesArr[0];
      });
  }

  selectRole(role) {
    this.dRole = role;
    localStorage.setItem('userRole', role);

    if (
      this.dRole === 'ReadOnly' ||
      this.dRole === 'Officer' ||
      this.dRole === 'Secretary' ||
      this.dRole === 'Translator' ||
      this.dRole === 'Superuser'
    ) {
      window.location.href = '/';
    } else if (this.dRole == 'Administrator') {
      window.location.href = '/lookups';
    } else {
      window.location.href = '/';
    }
  }

  login() {
    this.adalService.login();
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRoles');
    this.adalService.logOut();
  }

  get authenticated(): boolean {
    return fakeUser.enabled ? true : this.adalService.userInfo.authenticated;
  }

  get userName(): string {
    return fakeUser.enabled
      ? `Anonymous`
      : this.adalService.userInfo.profile.name;
  }
}
