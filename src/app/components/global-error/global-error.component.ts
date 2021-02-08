import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent implements OnInit {
  errId: string;
  errMesg: string;

  constructor(private activrouter: ActivatedRoute) {}

  ngOnInit() {
    this.errMesg = 'There has been an error!  ';

    this.activrouter.paramMap.subscribe((params) => {
      this.errId = params.get('errId');
      const usrId = params.get('usrId');
      if (this.errId == 'invalidUser') {
        this.errMesg += 'User ' + usrId + ' is not a UN authenticated user!';
      } else if (this.errId == 'notAuthenticated') {
        this.errMesg += `${usrId} is not an authorised UNSOL application user!`;
      }
    });
  }
}
