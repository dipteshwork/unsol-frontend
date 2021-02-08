export interface FeatureData {
  featureTypes: string;
  fStatus: string;
  fValue: string;
  fNotes: string;
  title: string;
  editRowIndex: number;
  editFeatureType: string;
  editFStatus: string;
  editFValue: string;
  editFNotes: string;
  editTitle: string;
  isReadOnly: boolean;
  isFreeTextEditable: boolean;
  isTranslationMode: boolean;
  lang: string;
  translations: object;
}
