import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
} from '@angular/forms';

export interface docDialogData {
  title: string;
  docNum: string;
  docType: string;
  docTyp1: string;
  issueDte: string;
  expDte: string;
  co;
  issuingCntry: string;
  issuedCntry: string;
  issuingCity: string;
  note: string;
  editRowIndex: number;
  editDocNum: string;
  editDocType: string;
  editDocTyp1: string;
  editIssueDte: string;
  editExpDte: string;
  editIssuingCntry: string;
  editIssuedCntry: string;
  editIssuingCity: string;
  editNote: string;
  isReadOnly: boolean;
  isFreeTextEditable: boolean;
  isTranslationMode: boolean;
  lang: string;
  translations: {};
}

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.scss'],
})
export class AddDocumentDialogComponent implements OnInit {
  docDialogform: FormGroup;
  translations: {};
  lang: string;
  tomorrow = new Date();
  yesterday = new Date();
  
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: docDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    if (this.data.editRowIndex || this.data.editRowIndex == 0) {
      this.docDialogform = this.editDoc();
    } else {
      this.docDialogform = this.createDocument();
    }
    if (this.data.isReadOnly) {
      this.docDialogform.disable();
    }
  }

  createDocument(): FormGroup {
    return this.formBuilder.group(
      {
        docNum: new FormControl(null),
        docType: null,
        docTyp1: '',
        issueDte: '',
        expDte: '',
        issuingCntry: '',
        issuedCntry: '',
        issuingCity: '',
        note: '',
      },
      { validator: DocDialogValidator }
    );
  }

  getMembrState(tmp1): [{}] {
    const result = tmp1.map((cntrys) => ({
      UN_name: cntrys.UN_name,
      Short_name: cntrys.en_Short,
    }));
    return result;
  }

  submit(docDialogform) {
    if (docDialogform.status == 'VALID') {
      this.dialogRef.close(docDialogform.value);
    }
  }

  editDoc(): FormGroup {
    return this.formBuilder.group(
      {
        docNum: this.data.editDocNum,
        docType: this.data.editDocType,
        docTyp1: this.data.editDocTyp1,
        issueDte: this.data.editIssueDte,
        expDte: this.data.editExpDte,
        editRowIndex: this.data.editRowIndex,
        issuingCntry: this.data.editIssuingCntry,
        issuedCntry: this.data.editIssuedCntry,
        issuingCity: this.data.editIssuingCity,
        note: this.data.editNote,
      },
      { validator: DocDialogValidator }
    );
  }
}

const DocDialogValidator: ValidatorFn = (fg: FormGroup) => {
  const docNum = fg.get('docNum').value;
  const docType = fg.get('docType').value;
  const issueDte = fg.get('issueDte').value;
  const expDte = fg.get('expDte').value;
  if (issueDte && expDte && expDte < issueDte) {
    return { dateErr: true };
  } else if (docNum == null && docType == null) {
    return { docNumErr: true, docTypeErr: true};
  } else if (docNum != null && docType == null) {
    return { docNumErr: false, docTypeErr: true};
  } else if (docNum == null && docType != null) {
    return { docNumErr: true, docTypeErr: false};
  } else {
    return null;
  }
};
