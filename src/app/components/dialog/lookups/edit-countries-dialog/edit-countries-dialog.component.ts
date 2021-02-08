import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../../services/admin.service';
import { LookupLst } from '../../../../classes/lookupLst';
import { LookupCollproviderProvider } from '../../../../services/providers/lookup-collprovider.service';
import { Language } from '../../../../models/languageModel';

@Component({
  selector: 'app-edit-countriesdialog',
  templateUrl: './edit-countries-dialog.component.html',
  styleUrls: ['./edit-countries-dialog.component.scss'],
})
export class EditCountriesDialogComponent implements OnInit {
  editCountriesDialogform: FormGroup;
  languageArr: Language[];
  appLang: string;
  lang: string;
  langArr: string[];
  translations: {};
  @Input('lkupSrv') lookupLst$: LookupLst;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCountriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, lang: string, translations: any },
    private lkupData: AdminService,
    private dialog: MatDialog,
    private lookupCollprovider: LookupCollproviderProvider
  ) {}

  ngOnInit() {
    this.loadLookUp();
    this.translations = this.data.translations;
    this.appLang = this.data.lang.toLowerCase();
    this.lang = this.appLang;
    this.editCountriesDialogform = this.editCountries();
  }

  loadLookUp() {
    this.lookupLst$ = this.lookupCollprovider.getLookupColl();
    this.langArr = this.lookupLst$['language'].map(
      lang => lang.acronym
    );
    this.languageArr = this.lookupLst$['language'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editCountries(): FormGroup {
    return this.fb.group(
      {
        unName: new FormControl(this.data['row'].UN_name),
        m49Cde: new FormControl(this.data['row'].M49_code),
        isoCde: new FormControl(this.data['row'].ISO_code),
        enS: new FormControl(this.data['row'].en_Short),
        frS: new FormControl(this.data['row'].fr_Short),
        spS: new FormControl(this.data['row'].sp_Short),
        ruS: new FormControl(this.data['row'].ru_Short),
        chS: new FormControl(this.data['row'].ch_Short),
        arS: new FormControl(this.data['row'].ar_Short),
        unMem: new FormControl(this.data['row'].UN_Membership),
        enF: new FormControl(this.data['row'].en_Formal),
        frF: new FormControl(this.data['row'].fr_Formal),
        spF: new FormControl(this.data['row'].sp_Formal),
        ruF: new FormControl(this.data['row'].ru_Formal),
        chF: new FormControl(this.data['row'].ch_Formal),
        arF: new FormControl(this.data['row'].ar_Formal),
        isActive: new FormControl(this.data['row'].isActive),
      },
      { validator: EditCountriesDialogValidator }
    );
  }

  changeLang(lang: string) {
    this.lang = lang.toLowerCase();
  }

  submit(editCountriesDialogform) {
    if (editCountriesDialogform.status == 'VALID') {
      const oldRowData = this.data;
      const modifiedRowData = editCountriesDialogform.value;
      const dta: any = {
        oldRowData: oldRowData,
        modifiedRowData: modifiedRowData,
      };

      let result = null;
      this.lkupData.updateCountry(dta).subscribe((data) => {
        result = data;
        this.dialogRef.close(result);
      });
    }
  }
}
const EditCountriesDialogValidator: ValidatorFn = (fg: FormGroup) => {
  return null;
  /*
  const featureType = fg.get('featureType').value;
  const fValue = fg.get('fValue').value;
  return featureType == null && fValue == null
    ? { 'fErrVals': true}
    : null;
  */
};
