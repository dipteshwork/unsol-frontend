import { Sanctionintf, ActivityLogintf, SanctionMetaDataInf } from '../models/sanctionintf';

export class Identity {
  address: [{}];
  biometricInf: [{}]; idType: string; category: string;
  dobs: [{}]; docs: [{}]; features: [{}];
  livingStatus: [string]; genderStatus: {};
  pobs: [{}]; names: [{}]; nationaltty: string[]; idTitle: string; idDesig: string[];
  comment: string;
  constructor(address: [{}],
    biometricInf: [{}], names: [{}], dobs: [{}], docs: [{}], features: [{}],
    livingStatus: [string], genderStatus: {}, nationaltty: string[], idType: string, category: string,
    pobs: [{}], idTitle, idDesig: string[], idNotes) {
    this.address = address;
    this.biometricInf = biometricInf;
    this.dobs = dobs; this.docs = docs; this.features = features;
    this.livingStatus = livingStatus; this.genderStatus = genderStatus;
    this.names = names;
    this.pobs = pobs;
    this.nationaltty = nationaltty;
    this.idType = idType;
    this.category = category;
    this.idTitle = idTitle;
    this.idDesig = idDesig;
    this.comment = idNotes;
  }

  public get getAddress(): [{}] {
    return this.address;
  }
  public get getBiometricInf(): [{}] {
    return this.biometricInf;
  }

  public get getIdType(): string {
    return this.idType;
  }
  public get getCategory(): string {
    return this.category;
  }

  get getdobs(): [{}] {
    return this.biometricInf;
  }

  public get getdocs(): [{}] {
    return this.docs;
  }

  public get getFeatures(): [{}] {
    return this.features;
  }
  public get getLivingStatus(): [string] {
    return this.livingStatus;
  }

  public get getGenderStatus(): {} {
    return this.genderStatus;
  }

  public get getNames(): [{}] {
    return this.names;
  }
  public get getPobs(): [{}] {
    return this.pobs;
  }
  public get getNationaltty(): string[] {
    return this.nationaltty;
  }
}

export class ActivityLog implements ActivityLogintf {
  activityDate: Date; userEmail: string; userTask: string;
  activityNotes: string; prevState: string; nextState: string; refNum: string; orderId: number;
  constructor(activityDate: Date, userEmail: string, userTask: string,
    prevState: string, nextState: string, activityNotes: string, refNum: string, orderId: number) {
    this.activityDate = activityDate;
    this.userEmail = userEmail;
    this.userTask = userTask;
    this.activityNotes = activityNotes;
    this.userTask = userTask;
    this.prevState = prevState;
    this.nextState = nextState;
    this.refNum = refNum;
    this.orderId = orderId;
  }
}

export class SanctionMetaData implements SanctionMetaDataInf {
  'amendmentInfo': [{ 'amendmentIndexCount': number, 'amendmentDte': Date, child: { 'identifier': string } }]; // this is for the ACtive record
  'amendmentIndexCount': number; // this is for any child record, regardles whether or not it ever becomes ACTIVE
  'supersededInfo': { 'isSuperSeded': boolean, 'supersededDte': Date };
  'ancestors': [{ 'identifier': string }];
  'children': [{ 'identifier': string }];
  'parent': string;
  'siblings': [{ 'identifier': string, 'entryId': number, 'entryStatus': string, 'entryStatusCreateDte': Date }];
  // placeholder in case we need to keep track of the same individual, entity, vessel, etc. being sanctiond under another regime
  'sameSubjectFoundInOtherSanctionEntries': [{ 'identifier': string }];
  'versionId': string;
  'docUnderscoreId': string;
  'prevState': string;
  'nextState': string;
  'userEmail': string;
  'workingMainLanguage': string;
  constructor(docUnderscoreId: string) {
    this.docUnderscoreId = docUnderscoreId;
  }

  public setPrevState(prevState) {
    this.prevState = prevState;
  }
  public setNextState(nextState) {
    this.nextState = nextState;
  }
  public setSupersededInfo(supersededInfo) {
    this.supersededInfo = supersededInfo;
  }
  public setAmendmentInfo(amendmentInfo) {
    this.amendmentInfo = amendmentInfo;
  }
  public addAmendmentInfo(amendmentInfo) {
    if (this.amendmentInfo == null) {
      this.amendmentInfo = amendmentInfo;
    } else {
      this.amendmentInfo.push(amendmentInfo);
    }
  }
  public setParent(parent) {
    this.parent = parent;
  }
  public setChildren(children) {
    this.children = children;
  }
  public addChildren(childId) {
    if (this.children == null) {
      this.children = [{ 'identifier': childId }];
    } else {
      this.children.push({ 'identifier': childId });
    }
  }

  public setAncestors(ancestors) {
    this.ancestors = ancestors;
  }
  public addAncestors(ancestorId) {
    if (this.ancestors == null) {
      this.ancestors = [{ 'identifier': ancestorId }];
    } else {
      this.ancestors.push({ 'identifier': ancestorId });
    }
  }

  public setSiblings(siblings) {
    this.siblings = siblings;
  }
  public addSiblings(siblings) {
    if (this.siblings == null) {
      this.siblings = [siblings];
    } else {
      this.siblings.push();
    }
  }
}

export class SanctionInputEntry implements Sanctionintf {
  recType: string; status: string; interpolNum: string; regime: string;
  refNum: string; lstngNotes: string; mbrStConfid: boolean; submittdBy: string[];
  submittdOn: string; statementConfid: string; lstngReason: string; addtlInfo: string; relatdLst: string[];
  availDte: string;
  // idstuff  ??? idDesign, idTitle, identity
  lstReq: {};
  narrativeSumm: [string];
  newEntry: string;
  applicableMeasures: string[];
  idArr: Identity[]; removedStatusDte: Date; removedStatusReason: string; priortoremovedState: string;
  activityLog: ActivityLog;
  narrWebsteUpdteDte: string[];
  measureArr: [string];
  updatedArr: [{}]; lstRmrks: string;
  sanctionMetaData: SanctionMetaData;
  workingMainLanguage: string; userEmail: string; isSubmitReviewMp: Map<string, {}>; lang: string;
  versionId: string;
  constructor(
    recType: string, status: string, interpolNum: string, regime: string,
    refNum: string, lstngNotes: string, mbrStConfid: boolean, submittdBy: string[],
    submittdOn: string, lstngReason: string, addtlInfo: string, relatdLst: string[],
    availDte: string,
    newEntry: string,
    idArr: Identity[],
    // idstuff  ??? idDesign, idTitle, identity
    lstReq: {},
    narrativeSumm: [{ lstngReason: string, addtlInf: string, relatdLst: String[], availDte: Date }], applicableMeasures: string[], narrWebsteUpdteDte: string[],
    removedStatusDte, removedStatusReason, priortoremovedState,
    activityLog: ActivityLog, statementConfid, measureArr: [string], updatedArr: [{}], lstRmrks: string,
    sanctionMetaData: SanctionMetaData, workingMainLanguage: string, userEmail: string, lang: string
  ) {
    this.recType = recType; this.status = status; this.interpolNum = interpolNum;
    this.regime = regime;
    this.refNum = refNum; lstngNotes = lstngNotes; this.mbrStConfid = mbrStConfid;
    this.submittdBy = submittdBy;
    this.submittdOn = submittdOn; this.lstngReason = lstngReason;
    this.addtlInfo = addtlInfo;
    this.relatdLst = relatdLst;
    this.availDte = availDte;
    // idstuff  ??? idDesign, idTitle, identity
    this.lstReq = lstReq;
    // this.narrativeSumm = narrativeSumm;
    this.newEntry = newEntry;
    this.idArr = idArr;
    this.removedStatusDte = removedStatusDte;
    this.removedStatusReason = removedStatusReason;
    this.statementConfid = statementConfid;
    this.priortoremovedState = priortoremovedState;
    this.applicableMeasures = applicableMeasures;
    this.narrWebsteUpdteDte = narrWebsteUpdteDte;
    this.activityLog = activityLog;
    this.measureArr = measureArr;
    this.updatedArr = updatedArr;
    this.lstRmrks = lstRmrks;
    this.sanctionMetaData = sanctionMetaData;
    this.workingMainLanguage = workingMainLanguage;
    this.userEmail = userEmail;
    this.lang = lang;
  }


  public get getRecType(): string {
    return this.recType;
  }

  public get getStatus(): string {
    return this.status;
  }
  public get getInterpolNum(): string {
    return this.interpolNum;
  }

  public get getRegime(): string {
    return this.regime;
  }
  public get getRefNum(): string {
    return this.refNum;
  }

  public get getLstngNotes(): string {
    return this.lstngNotes;
  }
  public get getMbrStConfid(): boolean {
    return this.mbrStConfid;
  }
  public get getSubmittdBy(): string[] {
    return this.submittdBy;
  }
  public get getSubmittdOn(): string {
    return this.submittdOn;
  }

  public get getLtngReason(): string {
    return this.lstngReason;
  }
  public get getAddtlInfo(): string {
    return this.addtlInfo;
  }

  public get getRelatdLst(): String[] {
    return this.relatdLst;
  }
  get getAvailDte(): string {
    return this.availDte;
  }


  public get getLstReq(): {} {
    return this.lstReq;
  }

  public get getNarrativeSumm(): [string] {
    return this.narrativeSumm;
  }

  public get getNewEntry(): string {
    return this.newEntry;
  }

  public get getLstRmrks(): string {
    return this.lstRmrks;
  }

  public addSanctionMetaDataAncestors(ancestorId: string) {
    this.sanctionMetaData.addAncestors(ancestorId);
  }
}
