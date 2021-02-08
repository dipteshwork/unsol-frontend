import { Sanctionintf } from '../models/sanctionintf';

export class Init {
  static readonly type = '[SanctUser] Init';
  constructor() {}
}

export class New {
  static readonly type = '[SanctUser] New';
  constructor(public entryId: number, public refNum: string) {}
}

export class ActiveSanctions {
  static readonly type = '[AllActiveSancts] ActiveSanctions';
  constructor(public sanctionState: string) {}
}

export class SubmitPending {
  static readonly type = '[SanctUser] SubmitPending';
  constructor(public payload: Sanctionintf) {}
}

export class Activate {
  static readonly type = '[SanctUser] Activate';
  constructor(public entryId: number) {} // just a subset of data needed here; refNum, narativesum updteDte
}

export class Delist {
  static readonly type = '[SanctUser] Delist';
  constructor(public entryId: number, public refNum: number) {} // no data needed here to delist except the refnum or entity_id and the delist command
}

export class SubmittedToCommitte {
  static readonly type = '[SanctUser] CommitteSubmission';
  constructor(public payload: Sanctionintf) {}
}

export class OnHold {
  static readonly type = '[SanctUser] OhHold';
  constructor(public entryId: number, public refNum: number) {}
}

export class OnHoldExt {
  static readonly type = '[SanctUser] Extendedhold';
  constructor(public entryId: number, public refNum: number) {} // just a subset of data needed here; refNum, narativesum updteDte
}

export class Remove {
  static readonly type = '[SanctUser] Remove';
  constructor(
    public entryId: number,
    public refNum: number,
    currState: string
  ) {} // no data needed here to delist except the refnum or entity_id and the delist command
}

export class RollbackRemove {
  static readonly type = '[SanctUser] Rollback';
  constructor(
    public entryId: number,
    public refNum: number,
    public prevState: string
  ) {} // no data needed here to delist except the refnum or entity_id and the delist command
}

export class SetSelectedSanction {
  static readonly type = '[SanctUser] SetSelectedSanct';

  constructor(public entryId: number, public refNum: string) {}
}
