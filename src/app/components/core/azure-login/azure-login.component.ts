import { AdalService } from 'adal-angular4';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-azure-login',
  templateUrl: './azure-login.component.html',
  styleUrls: ['./azure-login.component.scss'],
})
export class AzureLoginComponent implements OnInit {
  authenticated: boolean;
  constructor(private adalService: AdalService) {}

  ngOnInit() {
    this.authenticated = this.isAuthenticated();
  }

  isAuthenticated(): boolean {
    return this.adalService.userInfo.authenticated;
  }
}
