import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HomeComponent } from '../../../home/home.component';
import { SanctionLoadService } from '../../../../services/sanction-load.service';
import { NotificationService } from '../../../../services/alert/notification.service';

@Component({
  selector: 'app-xml-json-reports',
  templateUrl: './xml-json-reports.component.html',
  styleUrls: ['./xml-json-reports.component.scss'],
})
export class XmlJsonReportsComponent implements OnInit {
  selectedRowArray = [];
  selectedRowIndexArr = [];
  consolStr = 'consolidatedXMLRpt';
  xmlJsonRptForm: FormGroup;
  testLangVar = 'AR';
  languageArr = [];

  langs: Rpt[] = [
    { value: 'ALL', viewValue: 'All languages' },
    { value: 'AR', viewValue: 'Arabic' },
    { value: 'CH', viewValue: 'Chinese' },
    { value: 'EN', viewValue: 'English' },
    { value: 'FR', viewValue: 'French' },
    { value: 'RU', viewValue: 'Russian' },
    { value: 'SP', viewValue: 'Spanish' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entryIds: number[]; title: string, translations: {}, languageArr:string[], lang: string },
    private sancLoadSrv: SanctionLoadService,
    private notifyService: NotificationService,
  ) {}

  ngOnInit() {
    this.languageArr = this.data.languageArr;
    this.xmlJsonRptForm = this.fb.group({
      chosenRptTyp: new FormControl('3'),
      chosenRptLang: new FormControl('EN'),
    });
  }

  downloadJSONs(lang: string, idNumArr: number[]) {
    if (this.data['entryIds'] && this.data['entryIds'].length > 0) {
      let fileNm = idNumArr[0] + '.json';
      if (idNumArr.length > 0) {
        fileNm = idNumArr.join('_') + '.json';
      }

      // if idNumArr is empty, we want consolidateXML, or consolidated JSON
      this.sancLoadSrv.getJSONs(idNumArr).subscribe((data) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileNm;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });

      // now clear the arrays to remove highlighting
      this.selectedRowIndexArr.length = 0;
      this.selectedRowArray.length = 0;
    } else {
    }
  }

  //aw need status from frontend as soon as it is fixed
  async downloadConslXML(lang: string, idNumArr: number[], reportType: string) {

    return new Promise((resolve, reject) => {
      const status = 3;

      let fileName = 'ConsolidatedRpt.xml';
      if (idNumArr.length > 0) {
        fileName = 'SanctionEntryRpt_' + idNumArr.join('_') + '.xml';
      }
  
      // if idNumArr is empty, we want consolidateXML, else requesting for individual Xmls
      return this.sancLoadSrv
        .getConsolidatedXML(idNumArr, status, lang, reportType)
        .subscribe((xdata) => {
          if (xdata.type === 'text/html') {
            const url = window.URL.createObjectURL(xdata);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          } else {
            console.log('data is empty now!!');
            const tranMsg = this.getTranslation(this.data.lang, 'Export data is empty');
            this.notifyService.showWarning(
              tranMsg,
              'Warning'
            );
          }
  
          // now clear the arrays to remove highlighting
          this.selectedRowIndexArr.length = 0;
          this.selectedRowArray.length = 0;
          resolve(true);
        });
    });

  }

  getTranslation(lang, str) {
    return this.data.translations[lang.toLowerCase()][str] || str;
  }

  async submit(xmlJsonRptForm) {
    if (xmlJsonRptForm.controls.chosenRptTyp.value == '1') {
      const lang = xmlJsonRptForm.controls.chosenRptLang.value;
      this.downloadJSONs(lang, this.data['entryIds']);
    } else if (
      xmlJsonRptForm.controls.chosenRptTyp.value == '2' ||
      xmlJsonRptForm.controls.chosenRptTyp.value == '3'
    ) {
      const lang = xmlJsonRptForm.controls.chosenRptLang.value;
      const reportType = xmlJsonRptForm.controls.chosenRptTyp.value;

      if (lang != 'ALL') {
        await this.downloadConslXML(lang, this.data['entryIds'], reportType);
      } else {
        for (const languageItem of this.languageArr) {
          const res = await this.downloadConslXML(languageItem, this.data['entryIds'], reportType);
        }; 
        // this.languageArr.forEach((tmpLang, index) => {
        //   this.downloadConslXML(tmpLang, this.data['entryIds'], reportType);
        // });
        // console.log('gt')

      }
    } else {
      const lang = xmlJsonRptForm.controls.chosenRptLang.value;
      const reportType = xmlJsonRptForm.controls.chosenRptTyp.value;

      if (lang != 'ALL') {
        await this.downloadConslXML(lang, this.data['entryIds'], reportType);
      } else {
        for (const languageItem of this.languageArr) {
          const res = await this.downloadConslXML(languageItem, this.data['entryIds'], reportType);
        };   
        // this.languageArr.map((tmpLang) =>
        //   this.downloadConslXML(tmpLang, this.data['entryIds'], reportType)
        // );
      }

      // this.downloadConslXML(lang, this.data['entryIds'], reportType);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Rpt {
  value: string;
  viewValue: string;
}
