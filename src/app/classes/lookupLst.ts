import { Language } from '../models/languageModel';

export class LookupLst {
  constructor(
    public _id: [string],
    public entryStatus: [string],
    public entryType: [string],
    public language: [Language],
    public features: [string],
    public idType: [string],
    public identity: {},
    public idCategory: [{}],
    public dobType: [{}],
    public dobSubset: [{}],
    public biometricType: [string],
    public livingStatus: [string],
    public gender: [string],
    public nameOrgSptType: {},
    public scriptType: {},
    public regime: [{}],
    public translations: { translation: [{}] },
    public un_country_list: {},
    public docType1: [string],
    public measures: [{}],
    public pressReleaseUpdteTyp: [string],
    public featuresStatus: [string]
  ) { }
}
