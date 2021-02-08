import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Role } from '../interfaces/role';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class AuthService {
  currentUser: any = {};
  uri = environment.uri;
  users: [User];
  roles: [Role];
  preferLang: string = "en";

  constructor(private http: HttpClient) {}

  /*
    login(email:string, password:string ) {
        let credentials = {
          "user": {
            "email": email,
            "password": password
          }
        };
        return this.http.post<User>(this.uri + '/user/users/login', credentials)
            // this is just the HTTP call,
            // we still need to handle the reception of the token
            .do(res => this.setSession)
            .shareReplay();
    }


    private setSession(authResult) {
      const expiresAt = moment().add(authResult.expiresIn,'second');
      console.log('the session expires at ', JSON.stringify(expiresAt.valueOf()), 'or beter format is ' ,  moment(expiresAt) );
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    }

    logout() {  //aw should we make a backend call to node for this as well??
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        console.log('Now checking to see if the user is logged in', moment().isBefore(this.getExpiration()));
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    */

  getJwtToken(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + '/user/getToken', data)
        .subscribe(response => {
          resolve(response);
        });
    });
  }

  // call backend to load All Users
  getUsers(filterValue?) {
    return new Promise((resolve, reject) => {
      this.http
        .get<[User]>(filterValue ? this.uri + '/user/security/users/getUsers' + '/' + filterValue : this.uri + '/user/security/users/getUsers')
        .subscribe(response => {
          this.users = response;
          resolve(response);
        });
    });
  }

  getUser(userEmail: any) {
    console.log('testtest', userEmail)
    return this.http.post<User>(
      this.uri + '/user/security/users/getUser',
      userEmail
    );
  }

  // retrieve user role
  getUserRole() {
    // should read in jsonStr as argument
    // need just a single user to be returned
  }

  addUser(user: User) {
    // should read in jsonStr as argument
    return this.http.post<User>(
      this.uri + '/user/security/users/insertUser',
      user
    );
  }

  updateUser(user: any) {
    // should read in jsonStr as argument
    return this.http.post<User>(
      this.uri + '/user/security/users/updateUser',
      user
    );
  }

  deleteUser(userEmail: any) {
    return this.http.post<User>(
      this.uri + '/user/security/users/deleteUser',
      userEmail
    );
  }

  // call backend to load All Roles
  getRoles(filterValue?) {
    return this.http.get<[Role]>(filterValue ? this.uri + '/user/security/getRoles' + '/' + filterValue : this.uri + '/user/security/getRoles');
  }

  getRole() {
    return this.http.get<Role>(this.uri + '/user/security/getRole');
  }

  addRole(role: Role) {
    // should read in jsonStr as argument
    return this.http.post<Role>(this.uri + '/user/security/insertRole', role);
  }

  updateRole(dta: any) {
    // should read in jsonStr as argument
    return this.http.post<any>(this.uri + '/user/security/updateRole', dta);
  }

  deleteRole(data: any) {
    return this.http.post<any>(this.uri + '/user/security/deleteRole', data);
  }

  getPreferLang(): string {
    return this.preferLang;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setPreferLang(lang: string) {
    this.preferLang = lang;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }
}
