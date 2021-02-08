import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { Router } from '@angular/router';
import { WorkflowServService } from '../../../../services/workflow-service/workflow-serv.service';

@Component({
  selector: 'app-workflow-versions',
  templateUrl: './workflow-versions.component.html',
  styleUrls: ['./workflow-versions.component.scss'],
})
export class WorkflowVersionsComponent implements OnInit {
  STATUS_ACTIVE = 'ACTIVE';
  activeData: {
    version: String;
    status: String;
    modifiedDte: String;
    entryId: Number;
    name: String;
  } = null;
  currentVersion: {
    version: String;
    status: String;
    modifiedDte: String;
    entryId: Number;
    name: String;
    amendmentId: String;
    refNum: String;
  };
  versionHistoryDataSrc = new MatTableDataSource();
  ongoingAmendmentsDataSrc = new MatTableDataSource();
  supersededversDataSrc = new MatTableDataSource();
  supersededversDisplayedColumns: string[] = [
    'version',
    'status',
    'modifiedDte',
  ];
  ongoingAmendmentsDisplayedColumns: string[] = [
    'version',
    'status',
    'modifiedDte',
  ];
  versionHistDisplayedColumns: string[] = ['version', 'status', 'modifiedDte'];
  translations: {};
  lang: string;

  constructor(
    private workflowService: WorkflowServService,
    private router: Router,
    public dialogRef: MatDialogRef<WorkflowVersionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.workflowService
      .getAllVersions(this.data['entryId'], this.data['refNum'])
      .subscribe((data) => {
        const versionHistory = data['verHist'].filter(
          (item) => item.lang === this.data.lang
        );
        this.versionHistoryDataSrc.data = versionHistory.reverse();
        this.ongoingAmendmentsDataSrc.data = data['ongoingAmendments']
        this.supersededversDataSrc.data = data['superseded'];
        this.activeData = data['active'][0] || null;
        this.currentVersion = data['currentVersion'][0] || null;
      });
  }

  getActiveRecordDetails(activeVersion) {
    const entryId = activeVersion['entryId'];
    const status = activeVersion['status'];
    const refNum = activeVersion['refNum'] || undefined;
    const myurl = !refNum ? `/user/${entryId}/${status}` : `/user/${entryId}/${refNum}/${status}`;

    this.router.navigateByUrl(myurl).then((e) => {
      if (e) {
        this.router.onSameUrlNavigation = 'ignore';
      } else {
        this.router.onSameUrlNavigation = 'ignore';
      }
      this.closeDialog();
    });
  }

  getRecordDetails(tmp: number) {
    const returnedVal = this.versionHistoryDataSrc.data[tmp];
    const entryId = returnedVal['entryId'];
    const names = returnedVal['name'];
    const status = returnedVal['status'];
    const refNum = null;
    const isStatusCurrent =
      returnedVal['isStatusCurrent'] === false ? 'false' : 'true';

    this.router.onSameUrlNavigation = 'reload';
    const myurl = `/user/${entryId}/${names}/${refNum}/status/${status}/isStatusCurrent/${isStatusCurrent}`;
    this.router.navigateByUrl(myurl).then((e) => {
      if (e) {
        this.router.onSameUrlNavigation = 'reload';
      } else {
        this.router.onSameUrlNavigation = 'ignore';
      }
      this.closeDialog();
    });
  }

  getOngoingAmendmentRecord(tmp: number) {
    const returnedVal = this.ongoingAmendmentsDataSrc.data[tmp];
    const entryId = returnedVal['entryId'];
    const status = returnedVal['status'];
    const refNum = returnedVal['refNum'] || undefined;
    const amendmentId = returnedVal['amendmentId'];
    const myurl = amendmentId ? 
      `/user/${entryId}/${refNum}/${status}/${amendmentId}?lang=EN` :
      `/user/${entryId}/${refNum}/${status}?lang=EN`;

    this.router.navigateByUrl(myurl).then((e) => {
      if (e) {
        this.router.onSameUrlNavigation = 'reload';
      } else {
        this.router.onSameUrlNavigation = 'ignore';
      }
      this.closeDialog();
    });
  }

  getSupsersededRecord(tmp: number) {
    const returnedVal = this.supersededversDataSrc.data[tmp];
    const entryId = returnedVal['entryId'];
    const status = returnedVal['status'];
    const refNum = returnedVal['refNum'] || undefined;
    const amendmentId = returnedVal['amendmentId'];
    const myurl = amendmentId ?
      `/user/${entryId}/${refNum}/${status}/${amendmentId}?lang=EN` :
      `/user/${entryId}/${refNum}/${status}?lang=EN`;

    this.router.navigateByUrl(myurl).then((e) => {
      if (e) {
        this.router.onSameUrlNavigation = 'reload';
      } else {
        this.router.onSameUrlNavigation = 'ignore';
      }
      this.closeDialog();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
