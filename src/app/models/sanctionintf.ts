export interface Sanctionintf {
  recType: string;
  status: string;
  interpolNum: string;
  regime: string;
  refNum: string;
  lstngNotes: string;
  mbrStConfid: boolean;
  submittdBy: string[];
  submittdOn: string;
  statementConfid: string;
  lstngReason: string;
  addtlInfo: string;
  relatdLst: string[];
  availDte: string;
  // idstuff  ??? idDesign, idTitle, identity
  lstReq: {};
  narrativeSumm: [string];
  newEntry: string;
  applicableMeasures: string[];
  idArr: Identityintf[];
  removedStatusDte: Date;
  removedStatusReason: string;
  priortoremovedState: string;
  activityLog: ActivityLogintf;
  narrWebsteUpdteDte: string[];
  measureArr: [string];
  updatedArr: [{}];
  sanctionMetaData: SanctionMetaDataInf;
}

export interface SanctionMetaDataInf {
  amendmentInfo: [
    {
      amendmentIndexCount: number;
      amendmentDte: Date;
      child: { identifier: string };
    }
  ];
  amendmentIndexCount: number;
  supersededInfo: { isSuperSeded: Boolean; supersededDte: Date };
  ancestors: [{ identifier: string }];
  children: [{ identifier: string }];
  parent: string;
  siblings: [
    {
      identifier: string;
      entryId: number;
      entryStatus: string;
      entryStatusCreateDte: Date;
    }
  ];
  // placeholder in case we need to keep track of the same individual, entity, vessel, etc. being sanctiond under another regime
  sameSubjectFoundInOtherSanctionEntries: [{ identifier: string }];
  versionId: string;
  docUnderscoreId: string;
  prevState: string;
  nextState: string;
}

export interface Identityintf {
  address: [{}];
  biometricInf: [{}];
  idType: string;
  category: string;
  dobs: [{}];
  docs: [{}];
  features: [{}];
  livingStatus: [string];
  genderStatus: {};
  pobs: [{}];
  names: [{}];
  nationaltty: string[];
  idTitle: string;
  idDesig: string[];
  comment: string;
}

export interface ActivityLogintf {
  activityDate: Date;
  userEmail: string;
  userTask: string;
  activityNotes: string;
  prevState: string;
  nextState: string;
  refNum: string;
  orderId: number;
}

export interface PressReleaseintf {
  entryId: number;
  pressRelease: string;
  updateType: string;
  updatedOn: string;
  pressReleaseId: string;
  refNum: string;
}
