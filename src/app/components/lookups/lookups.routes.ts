import { Routes } from '@angular/router';
import { MeasuresLkComponent } from './measures-lk/measures-lk.component';
import { EntryTypesLkComponent } from './entry-types-lk/entry-types-lk.component';
import { RegimesLkComponent } from './regimes-lk/regimes-lk.component';
import { CountriesLkComponent } from './countries-lk/countries-lk.component';
import { BiometricLkComponent } from './biometric-lk/biometric-lk.component';
import { CategoriesLkComponent } from './categories-lk/categories-lk.component';
import { GenderLkComponent } from './gender-lk/gender-lk.component';
import { IdtypsLkComponent } from './idtyps-lk/idtyps-lk.component';
import { LivingstatLkComponent } from './livingstat-lk/livingstat-lk.component';
import { FeaturesLkComponent } from './features-lk/features-lk.component';
import { LangsLkComponent } from './langs-lk/langs-lk.component';
import { TranslationsLkComponent } from './translations-lk/translations-lk.component';

export const LOOKUP_ROUTES: Routes = [
  { path: '', redirectTo: 'entry-types', pathMatch: 'full' },
  { path: 'entry-types', component: EntryTypesLkComponent },
  { path: 'measures', component: MeasuresLkComponent },
  { path: 'regimes', component: RegimesLkComponent },
  { path: 'countries', component: CountriesLkComponent },
  { path: 'gender', component: GenderLkComponent },
  { path: 'livstatus', component: LivingstatLkComponent },
  { path: 'translations', component: TranslationsLkComponent },
  { path: 'biometric', component: BiometricLkComponent },
  { path: 'categories', component: CategoriesLkComponent },
  { path: 'langs', component: LangsLkComponent },
  { path: 'features', component: FeaturesLkComponent },
  { path: 'idtyps', component: IdtypsLkComponent },

  { path: '**', pathMatch: 'full', redirectTo: 'entry-types' },
];
