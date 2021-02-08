import {
  Component,
  OnInit,
  Inject,
  Input,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Language } from '../../../models/languageModel';
import { LookupCollproviderProvider } from '../../../services/providers/lookup-collprovider.service';
import { LookupLst } from '../../../classes/lookupLst';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-delete-general',
  templateUrl: './delete-general.component.html',
  styleUrls: ['./delete-general.component.scss'],
})
export class BiomatricTypeComponent implements OnInit {
  languageArr: Language[];
  sancEntryTypForm: FormGroup;
  lang: string;
  appLang: string;
  translations: {};
  langArr: string[];
  @Input('lkupSrv') lookupLst$: LookupLst;
  constructor(
    private adminsrv: AdminService,
    private lookupSrv: LookupCollproviderProvider,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BiomatricTypeComponent>,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.loadLookup();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.lookupSrv
      .load(this.appLang.toUpperCase(), filterValue, 'regime')
      .then(() => {
        this.loadLookup();
      });
  }

  delete(index, routeName): void {
    if (routeName == '/lookups/biometric') {
      let PopObject = this.lookupLst$.biometricType.splice(index, 1);
      let newObject = this.lookupLst$.biometricType;
      this.adminsrv
        .deleteBiometricType({
          biometricData: newObject,
          _id: this.lookupLst$._id,
        })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/entry-types') {
      console.log('I am Entry');
      let PopObject = this.lookupLst$.entryType.splice(index, 1);
      let newObject = this.lookupLst$.entryType;
      this.adminsrv
        .deleteEntryTyp({ entryTypeData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
          this.loadLookup();
          this.applyFilter('');
          this.dialogRef.close();
        });
    } else if (routeName === '/lookups/measures') {
      console.log('I am measures');
      let PopObject = this.lookupLst$.measures.splice(index, 1);
      let newObject = this.lookupLst$.measures;

      this.adminsrv
        .deleteMeasure({ measureData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
        });
    } else if (routeName === '/lookups/regimes') {
      console.log('I am regimes');
      let PopObject = this.lookupLst$.regime.splice(index, 1);
      let newObject = this.lookupLst$.regime;
      this.adminsrv
        .deleteReime({ regimeData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/countries') {
      console.log('I am countries');
      let PopObject = this.lookupLst$.un_country_list;
      let newObject = this.lookupLst$.un_country_list;
      this.adminsrv
        .deleteCountry({
          countryRecordData: newObject,
          _id: this.lookupLst$._id,
        })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/gender') {
      console.log('I am gender');
      let PopObject = this.lookupLst$.gender.splice(index, 1);
      let newObject = this.lookupLst$.gender;
      this.adminsrv
        .deleteGender({ genderData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/livstatus') {
      console.log('I am livstatus');
      let PopObject = this.lookupLst$.livingStatus.splice(index, 1);
      let newObject = this.lookupLst$.livingStatus;
      this.adminsrv
        .deleteLivingStatus({
          livingStatusData: newObject,
          _id: this.lookupLst$._id,
        })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/translations') {
      console.log('I am translations');
      let PopObject = this.lookupLst$.translations['translation'].splice(index, 1);
      let newObject = this.lookupLst$.translations;
      this.adminsrv
        .deleteTranslation({
          translationData: newObject,
          _id: this.lookupLst$._id,
        })
        .subscribe((data) => {
          console.log(data);
          this.applyFilter('');
        });
    } else if (routeName === '/lookups/categories') {
      console.log('I am categories');
      let PopObject = this.lookupLst$.idCategory.splice(index, 1);
      let newObject = this.lookupLst$.idCategory;
      this.adminsrv
        .deleteidCategory({
          idCategoryData: newObject,
          _id: this.lookupLst$._id,
        })
        .subscribe((data) => {
          console.log(data);
        });
    } else if (routeName === '/lookups/langs') {
      console.log('I am langs');
      let PopObject = this.lookupLst$.language.splice(index, 1);
      let newObject = this.lookupLst$.language;
      this.adminsrv
        .deleteLanguage({ languageData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
        });
    } else if (routeName === '/lookups/features') {
      console.log('I am features');
      let PopObject = this.lookupLst$.features.splice(index, 1);
      let newObject = this.lookupLst$.features;
      this.adminsrv
        .deleteFeature({ featuresData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
        });
    } else if (routeName === '/lookups/idtyps') {
      console.log('I am idtyps');
      let PopObject = this.lookupLst$.idType.splice(index, 1);
      let newObject = this.lookupLst$.idType;
      this.adminsrv
        .deleteIdTypes({ idTypesData: newObject, _id: this.lookupLst$._id })
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      console.log('Route Not Matched!');
    }
  }

  loadLookup() {
    this.lookupLst$ = this.lookupSrv.getLookupColl();
    this.appLang = this.authServ.getPreferLang();
    this.appLang = this.appLang.toLowerCase();
    this.translations = this.lookupSrv.getTranslations();
    this.langArr = this.lookupLst$.language.map((lang) => lang.acronym);
  }
  getTranslation(str) {
    return this.translations[this.appLang][str] || str;
  }
}
