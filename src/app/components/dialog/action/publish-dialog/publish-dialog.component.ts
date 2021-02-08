import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as _moment from 'moment';
import { PublishWarningDialogComponent } from '../publish-warning-dialog/publish-warning-dialog.component';
import diff from 'rich-text-diff';

@Component({
  selector: 'app-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.scss'],
})
export class PublishDialogComponent implements OnInit {
  publishForm: FormGroup;
  tomorrow = new Date();
  DIALOG_SM = window.screen.width > 768 ? '30%' : '80%';
  defaultRelease = '';
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '50px',
    placeholder: 'Enter Text Here',
    toolbar: [
      [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        'superscript',
        'subscript',
      ],
      ['fontName', 'fontSize', 'color'],
      [
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
      ],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      [
        'paragraph',
        'blockquote',
        'removeBlockquote',
        'horizontalLine',
        'orderedList',
        'unorderedList',
      ],
      ['link', 'unlink', 'image'],
    ],
  };
  diffResult = '';
  refNumber = '';
  listedOn = 'na';
  amendmentOn = '';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PublishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.publishForm = this.fb.group({
      updateType: new FormControl(this.data['updateType']),
      sanctionId: new FormControl(this.data['sanctionId']),
      listedOn: new FormControl('', Validators.required),
      pressRelease: new FormControl('', Validators.required),
    });

    this.publishForm.get('listedOn').valueChanges.subscribe((data) => {
      if (this.refNumber) {
     
        const changedDate = _moment(data).format('DD MMM. YYYY');
        this.amendmentOn = ` <strong>(Amended on: ${changedDate})</strong>`;
      } else {
        this.listedOn = _moment(data).format('DD MMM. YYYY');
      }
      this.initialSet();
    
    });
  }

  ngOnInit() {
    this.initialSet();
  };

  initialSet() {

    const matchObj = {
      0: 'a',
      1: 'b',
      2: 'c',
      3: 'd',
      4: 'e',
      5: 'f',
      6: 'g',
      7: 'h',
      8: 'i',
      9: 'j',
      10: 'k'
    };

    const identityDataArr = this.data.sanctionData.idArr;
    const pressReleaseArr = this.data.sanctionData.lstReq.pressRelease;
    if (pressReleaseArr && pressReleaseArr.length > 0) {
      this.listedOn = _moment(pressReleaseArr[0]['updatedOn']).format('DD MMM. YYYY');
    }
    this.refNumber = this.getRootRef(this.data.sanctionData.refNum) || '';
    const highIdArr = identityDataArr.filter((item) => item.category === 'High');
    const lowIdArr = identityDataArr.filter((item) => item.category === 'Low' || item.category === 'Medium');
    let akaHigh = '';
    let akaLow = '';

    if (highIdArr.length > 1) {
      highIdArr.forEach((idItem, index) => {
        let name = '';
        idItem.names.names.forEach(nameItem => {
          name += nameItem.name + ' ';
        });
        akaHigh += matchObj[index] + ') ' + name + ' '
      });
    } else if (highIdArr.length === 1) {
      let name = '';
      highIdArr[0].names.names.forEach(nameItem => {
        name += nameItem.name + ' ';
      });
      akaHigh = name;
    } else akaHigh = 'na';

    if (lowIdArr.length > 1) {
      lowIdArr.forEach((idItem, index) => {
        let name = '';
        idItem.names.names.forEach(nameItem => {
          name += nameItem.name + ' ';
        });
        akaLow += matchObj[index] + ') ' + name + ' '
      });
    } else if (lowIdArr.length === 1) {
      let name = '';
      lowIdArr[0].names.names.forEach(nameItem => {
        name += nameItem.name + ' ';
      });
      akaLow = name;
    } else akaLow = 'na';

    const identityData = this.data.sanctionData.idArr[0];

    let name = '';
    // if(identityData.names.names.length > 0) {
      for (let i = 1; i < 5; i++) {
        const nameValue = identityData.names.names[i -1] ? identityData.names.names[i -1].name : 'na';
        name += (i + ': ' + nameValue + ' ');
      }
    // }
    // name = name ? (' <strong>Name: </strong>' + name) : '';

    let orgName = '';
    // if(identityData.names.nameOrgSpt.length > 0) {
      for (let i = 1; i < 5; i++) {
        const nameValue = identityData.names.nameOrgSpt[i -1] ? identityData.names.nameOrgSpt[i -1].name : 'na';
        orgName += i + ': ' + nameValue + ' '
      }
    // }
    // orgName = orgName ? (' <p><strong>Name(original script): </strong>' +  orgName + '</p>') : '';

    let title = '';
    if(identityData.idTitle.title.length > 1) {
      identityData.idTitle.title.forEach((item, index) => {
        title += matchObj[index] + ') ' + item + ' '
      });
    } else if (identityData.idTitle.title.length === 1) {
      title = identityData.idTitle.title[0];
    } else title = 'na';
    // title = title ? (' <p><strong>Title: </strong>' + title) : '';

    let designation = '';
    if(identityData.idDesig.designation.length > 1) {
      identityData.idDesig.designation.forEach((item, index) => {
        designation += matchObj[index] + ') ' + item + ' '
      });
    } else if (identityData.idDesig.designation.length === 1) {
      designation = identityData.idDesig.designation[0];
    } else designation = 'na';
    // designation = designation ? (' <strong>Designation: </strong>' + designation) : '';

    let dob = '';
    if(identityData.dobs.length > 1) {
      identityData.dobs.forEach((item, index) => {
        dob += matchObj[index] + ') ' + _moment(item.dobSpecDte).format('DD MMM. YYYY') + ' '
      });
    } else if (identityData.dobs.length === 1) {
      dob = _moment(identityData.dobs[0].dobSpecDte).format('DD MMM. YYYY');
    } else dob = 'na';
    // dob = dob ? (' <strong>DOB: </strong>' + dob) : '';

    let pob = '';
    if(identityData.pobs.length > 1) {
      identityData.pobs.forEach((item, index) => {
        pob += matchObj[index] + ') ' +
        (
          (item.street ? (item.street + ', ') : '')  +
          (item.city ? (item.city + ', ') : '') +
          (item.stateProv ? (item.stateProv + ', ') : '') +
          (item.province ? (item.province + ', ') : '') +
          (item.country ? (item.country + ', ') : '') +
          (item.zipCde ? (item.zipCde) : '')
        )
        + ' '
      });
    } else if (identityData.pobs.length === 1) {
      pob =  (
        (identityData.pobs[0].street ? (identityData.pobs[0].street + ', ') : '')  +
        (identityData.pobs[0].city ? (identityData.pobs[0].city + ', ') : '') +
        (identityData.pobs[0].stateProv ? (identityData.pobs[0].stateProv + ', ') : '') +
        (identityData.pobs[0].province ? (identityData.pobs[0].province + ', ') : '') +
        (identityData.pobs[0].country ? (identityData.pobs[0].country + ', ') : '') +
        (identityData.pobs[0].zipCde ? (identityData.pobs[0].zipCde) : '')
      );
    } else pob = 'na';
    // pob = pob ? (' <strong>POB: </strong>' + pob) : '';

    let nationality = '';
    if(identityData.nationaltty.nationality.length > 1) {
      identityData.nationaltty.nationality.forEach((item, index) => {
        nationality += matchObj[index] + ') ' + this.data.nationalities.find(findItem => findItem.UN_name === item.nation)['en_Short'] + ' '
      });
    } else if (identityData.nationaltty.nationality.length === 1) {
      nationality = this.data.nationalities.find(findItem => findItem.UN_name === identityData.nationaltty.nationality[0].nation)['en_Short'];
    } else nationality = 'na';
    // nationality = nationality ? (' <strong>Nationality: </strong>' + nationality) : '';

    let passport = '';
    const passportArr = identityData.docs.filter(item => item.docType === 'Passport');
    if(passportArr.length > 1) {
      passportArr.forEach((item, index) => {
        passport += matchObj[index] + ') ' +
        item.issuingCntry + ' number ' + item.docNum + ', issued on ' +
        _moment(item.issueDte).format('DD MMM YYYY') + ' (issued by ' +
        item.issuedCntry + ', expires ' + _moment(item.expDte).format('DD MMM YYYY') + ') ';
      });
    } else if (passportArr.length === 1) {
      const item = passportArr[0];
      passport = item.issuingCntry + ' number ' + item.docNum + ', issued on ' +
      _moment(item.issueDte).format('DD MMM YYYY') + ' (issued by ' +
      item.issuedCntry + ', expires ' + _moment(item.expDte).format('DD MMM YYYY') + ') ';
    } else passport = 'na';

    let nationalId = '';
    const nationalIDArr = identityData.docs.filter(item => item.docType === 'National Identification Number');
    if(nationalIDArr.length > 1) {
      nationalIDArr.forEach((item, index) => {
        nationalId += matchObj[index] + ') ' +
        item.issuingCntry + ' number ' + item.docNum + ', issued on ' +
        _moment(item.issueDte).format('DD MMM YYYY') + ' (issued by ' +
        item.issuedCntry + ', expires ' + _moment(item.expDte).format('DD MMM YYYY') + ') ';
      });
    } else if (nationalIDArr.length === 1) {
      const item = nationalIDArr[0];
      nationalId = item.issuingCntry + ' number ' + item.docNum + ', issued on ' +
      _moment(item.issueDte).format('DD MMM YYYY') + ' (issued by ' +
      item.issuedCntry + ', expires ' + _moment(item.expDte).format('DD MMM YYYY') + ') ';
    } else nationalId = 'na';

    let address = '';
    if(identityData.address.length > 1) {
      identityData.address.forEach((item, index) => {
        address += matchObj[index] + ') ' +
        (
          (item.street ? (item.street + ', ') : '')  +
          (item.city ? (item.city + ', ') : '') +
          (item.stateProv ? (item.stateProv + ', ') : '') +
          (item.province ? (item.province + ', ') : '') +
          (item.country ? (item.country + ', ') : '') +
          (item.zipCde ? (item.zipCde) : '')
        )
        + ' '
      });
    } else if (identityData.address.length === 1) {
      address = (
        (identityData.address[0].street ? (identityData.address[0].street + ', ') : '')  +
        (identityData.address[0].city ? (identityData.address[0].city + ', ') : '') +
        (identityData.address[0].stateProv ? (identityData.address[0].stateProv + ', ') : '') +
        (identityData.address[0].province ? (identityData.address[0].province + ', ') : '') +
        (identityData.address[0].country ? (identityData.address[0].country + ', ') : '') +
        (identityData.address[0].zipCde ? (identityData.address[0].zipCde) : '')
      );
    } else address = 'na';
    // address = address ? (' <strong>Address: </strong>' + address) : '';

    let information = '';
    if(identityData.comment) {
      information = identityData.comment;
    } else information = 'na';

    if (
      this.data.sanctionData.recType === this.data.entryTypeTh ||
      this.data.sanctionData.recType === 'Individual'
    ) {
      this.defaultRelease =
        '<span> ' + '<strong>Name: </strong>' + name + '</span>' +
        '<p><strong>Name (original script): </strong>' +  orgName + '</p>' +
        '<p><strong>Title: </strong>' +
        title +
        ' <strong>Designation: </strong>' +
        designation +
        ' <strong>DOB: </strong>' +
        dob +
        ' <strong>POB: </strong>' +
        pob +
        ' <strong>Good quality a.k.a.: </strong>' +
        akaHigh +
        ' <strong>Low quality a.k.a.: </strong>' +
        akaLow +
        ' <strong>Nationality: </strong>' +
        nationality +
        ' <strong>Passport no: </strong>' +
        passport +
        ' <strong>National identification no: </strong>' +
        nationalId +
        ' <strong>Address: </strong>' +
        address +
        ' <strong>Listed on: </strong>' +
        this.listedOn +
        this.amendmentOn +
        ' <strong>Other information: </strong>' +
        information +
        ' INTERPOL-UN Security Council Special Notice web link: <a href="https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Individuals">https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Individuals</a>' +
        '</p>';
    } else {
      this.defaultRelease =
        '<span> ' + '<strong>Name: </strong>' + name + '</span>' +
        '<p><strong>Name (original script): </strong>' +  orgName + '</p>' +
        '<p><strong>AKAs: </strong>' +
        '' +
        ' <strong>FKAs: </strong>' +
        '' +
        ' <strong>Address: </strong>' +
        address +
        ' <strong>Listed on: </strong>' +
        this.listedOn +
        this.amendmentOn +
        ' <strong>Other information: </strong>' +
        information +
        ' INTERPOL-UN Security Council Special Notice web link: <a href="https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Individuals">https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Individuals</a>' +
        '</p>';
    }

    if (this.data.sanctionData.amendmentId) {
      this.getDiffWithParent();
    } else {
      this.diffResult = this.defaultRelease;
    }
  }

  submit(publishFormDialog) {
    if (this.publishForm.valid) {
      const allAmendmentInfo = this.data.allAmendmentInfo.filter(item => item.amendmentId);
      const sanctionData = this.data.sanctionData;
      const allAmendmentInfoExceptActive = allAmendmentInfo.filter(
        (amendInfo) => amendInfo.status !== 'ACTIVE' && amendInfo.refNum && !amendInfo.superseded
      );

      if (sanctionData.refNum && allAmendmentInfoExceptActive.length > 1) {
        // exclude itself
        let remainingAmendInfo = allAmendmentInfoExceptActive.filter(
          (amentEntry) => amentEntry.refNum !== sanctionData.refNum
        );

        // get reference number of the root in the hierachy
        let rootRefNum = this.getRootRef(sanctionData.refNum);

        // get amendments in the same hierachy
        remainingAmendInfo = remainingAmendInfo.filter(item => item.refNum.indexOf(rootRefNum) >= 0);

        if (remainingAmendInfo.length > 0) {
          const warningDialogRef = this.dialog.open(PublishWarningDialogComponent, {
            width: this.DIALOG_SM,
            data: {
              title: 'Warning',
              lang: this.data.lang,
              amendInfo: remainingAmendInfo,
              translations: this.data.translations,
            },
            hasBackdrop: true,
          });

          warningDialogRef.afterClosed().subscribe(
            (result) => {
              if (result === true) {
                this.dialogRef.close({ publishFormDialog, supersedeOthers: true });
              } else if (result === false) {
                this.dialogRef.close({ publishFormDialog, supersedeOthers: false });
              }
            },
            (error) => {
              // this.notifyService.showError(error, 'Error');
            }
          );
        } else {
          this.dialogRef.close({ publishFormDialog, supersedeOthers: false });
        }
      } else {
        this.dialogRef.close({ publishFormDialog, supersedeOthers: false });
      }
    }
  }

  getRootRef(refNum) {
    if (!refNum) return '';

    let rootRefNum = refNum;
    if (!refNum) {
      return '';
    } else if ((rootRefNum.match(/./g) || []).length > 1) {
      const arr = rootRefNum.split('.');
      rootRefNum = `${arr[0]}.${arr[1]}`;
    }
    return rootRefNum;
  }

  getDiffWithParent() {
    // get parent press release to be compared
    const curRefNum = this.data.sanctionData.refNum;
    let parentRefNum = curRefNum.substr(0, curRefNum.lastIndexOf('.'));
    const parent = this.data.allAmendmentInfo.find(item => item.refNum === parentRefNum);
    const prevPress = parent && parent.pressRelease[0] ? parent.pressRelease[0].pressRelease : this.defaultRelease;

    if (this.data.sanctionData.amendmentId) {
      this.diffResult = ('<strong>' + this.refNumber + '</strong> ') + diff(prevPress, this.defaultRelease);
    } else {
      this.diffResult = this.defaultRelease;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
