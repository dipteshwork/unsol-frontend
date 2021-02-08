import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialogRef,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from '@angular/material';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { SanctionLoadService } from '../../../../services/sanction-load.service';

export interface biometricDialogData {
  biometricTypes: ['photo', 'height', 'weight', 'attchmnt'];
  title: string;
  bioMType: string;
  bioMVal: string;
  bioMAttch: [string];
  bioMNote: string;
  editRowIndex: number;
  editBioMType: string;
  editBioMVal: string;
  editBioMAttch: [string];
  editBioMNote: string;
  isReadOnly: boolean;
  biometricTypesUsedArr: [string];
  isFreeTextEditable: string;
  isTranslationMode: boolean;
  tabId: number;
  lang: string;
  translations: {};
}

@Component({
  selector: 'app-biometric-dialog',
  templateUrl: './biometric-dialog.component.html',
  styleUrls: ['./biometric-dialog.component.scss'],
})
export class BiometricDialogComponent implements OnInit {
  fileIdsToBDeletedArr = [];
  biometricDialogform: FormGroup;
  bioMAttch: FormArray;
  prevAttchs: FormArray;
  loading = false;
  bioMetricDataSrc = new MatTableDataSource();
  lastFile: any;
  bioMDisplayedColumns: string[] = ['filename', 'filesize', 'delete', 'download'];
  lang: string;
  translations: {};
  activeBiometricTypes = [];

  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BiometricDialogComponent>,
    private sancLoadSvc: SanctionLoadService,
    @Inject(MAT_DIALOG_DATA) public data: biometricDialogData
  ) {}

  ngOnInit() {
    this.translations = this.data.translations;
    this.lang = this.data.lang.toLowerCase();
    this.activeBiometricTypes = this.data.biometricTypes.filter((item) => item[this.data.lang]['isActive']);
    this.lastFile = {} as File;
    if (this.data.editRowIndex >= 0) {
      this.biometricDialogform = this.editBiometric();
      if (this.data.editBioMAttch.length > 0) {
        this.lastFile = { name: this.data.editBioMAttch[this.data.editBioMAttch.length - 1]['filename'] };
        this.data.editBioMAttch.forEach((attchFromGrp) => {
          (<FormArray>this.biometricDialogform.get('bioMAttch')).push(
            this.formBuilder.control(attchFromGrp)
          );
        });
      }
    } else {
      this.biometricDialogform = this.createBiometric();
    }
    if (this.data.isReadOnly) {
      this.biometricDialogform.disable();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickInput(): void {
    !this.data.isReadOnly && this.fileInput.nativeElement.click();
  }

  submit(biometricDialogform) {
    const deletedIds = this.fileIdsToBDeletedArr;
    const tmpArrr: FormArray = this.prevAttchs;

    if (deletedIds.length > 0) {
      deletedIds.map((fileId) => {
        // get the rows marked for deletion and take them out of the form
        (<FormArray>this.biometricDialogform.get('fileIdsToBeDeleted')).push(
          this.formBuilder.control(fileId)
        );
        // get the file information that we are not deleting
        if (tmpArrr !== undefined) {
          tmpArrr.removeAt(
            tmpArrr.value.findIndex((filId) => filId.fileId == fileId)
          );
        }
      });
    }

    if (biometricDialogform.status == 'VALID') {
      this.loading = true;
      this.dialogRef.close(biometricDialogform.value);
    }
  }

  onSubmit() {
    this.loading = true;
  }

  createBiometric(): FormGroup {
    return this.formBuilder.group(
      {
        bioMType: new FormControl(null),
        bioMVal: null,
        prevAttchs: this.formBuilder.array([]),
        bioMAttch: this.formBuilder.array([]),
        biometricTypesUsedArr: [{ value: this.data.biometricTypesUsedArr }],
        fileIdsToBeDeleted: this.formBuilder.array([]),
        bioMNote: '',
      },
      { validator: biometricdValidator }
    );
  }

  editBiometric(): FormGroup {
    return this.formBuilder.group(
      {
        bioMType: this.data.editBioMType,
        bioMVal: this.data.editBioMVal,
        prevAttchs: this.createBiomAttchArray(),
        // bioMAttch: this.createBiomAttchArray(),
        bioMAttch: this.formBuilder.array([]),
        bioMNote: this.data.editBioMNote,
        biometricTypesUsedArr: [{ value: this.data.biometricTypesUsedArr }],
        fileIdsToBeDeleted: this.formBuilder.array([]),
        editRowIndex: this.data.editRowIndex,
        tabId: this.data.tabId,
      },
      { validator: biometricdValidator }
    );
  }

  createBiomAttchArray(): FormArray {
    const bioAttch = this.data.editBioMAttch;

    this.bioMetricDataSrc.data = bioAttch.map(function (attch) {
      return {
        fileId: attch['fileId'],
        filesize: attch['filesize'],
        filename: attch['filename'],
      };
    });

    this.prevAttchs = new FormArray(
      bioAttch.map((attch, index) => {
        return new FormGroup({
          filesize: new FormControl({
            value: this.bioMetricDataSrc.data[index]['filesize'],
            disabled: false,
          }),
          filename: new FormControl({
            value: this.bioMetricDataSrc.data[index]['filename'],
            disabled: false,
          }),
          fileId: new FormControl({ value: this.bioMetricDataSrc.data[index]['fileId'], disabled: false }),
        });
      })
    );
    return this.prevAttchs;
  }

  async onFileChange($event) {
    const files: File[] = $event.target.files;
    this.lastFile = files[files.length - 1];

    if ($event.target.files && $event.target.files[0]) {
      let formGroup = [];
      for (let i = 0; i < files.length; i++) {
        await new Promise((resolve) => {
          const f = files[i];
          const reader = new FileReader();
          reader.onload = () => {
            formGroup.push({
              fileId: (new Date()).getTime() + i,
              filename: f.name,
              filesize: f.size,
              fileTyp: f.type,
              filee: f
            });
            resolve(true);
          };
          reader.readAsDataURL(f);
        });
      }

      formGroup.forEach(form => {
        (<FormArray>this.biometricDialogform.get('bioMAttch')).push(this.formBuilder.control(form));
      });

      if (this.biometricDialogform.get('bioMAttch').value.length > 0) {
        this.bioMetricDataSrc.data = this.biometricDialogform.get('bioMAttch').value.map(function (attch) {
          return {
            filesize: attch['filesize'],
            filename: attch['filename'],
            fileId: attch['fileId'],
          };
        });
      }
    }
  }

  private prepareSave(): any {
    const input = new FormData();
    input.append('bioMType', this.biometricDialogform.get('bioMType').value);
    input.append('bioMVal', this.biometricDialogform.get('bioMVal').value);
    input.append('bioMNote', this.biometricDialogform.get('bioMNote').value);
    input.append('bioMAttch', this.biometricDialogform.get('bioMAttch').value);
    return input;
  }

  clearFile() {
    if (this.data.isReadOnly) return;

    for (let i = (<FormArray>this.biometricDialogform.get('bioMAttch')).length - 1; i >= 0 ; i--) {
      (<FormArray>this.biometricDialogform.get('bioMAttch')).removeAt(i);
    }
    this.lastFile = {} as File;
    this.fileInput.nativeElement.value = '';
    this.bioMetricDataSrc.data = [];
  }

  attachFile() {
    if (this.biometricDialogform.get('bioMAttch').value.length > 0) {
      this.bioMetricDataSrc.data = this.biometricDialogform.get('bioMAttch').value.map((attch) => ({
        filesize: attch['filesize'],
        filename: attch['filename'],
        fileId: attch['fileId'],
      }));
    }
  }

  deleteFiles(event, row, index) {
    console.log(
      'u just clicked ',
      row,
      ' the value is  here ',
      event.toElement.checked,
      ' the index is ',
      index
    );

    if (row['fileId'] && !this.fileIdsToBDeletedArr.includes(row['fileId'])) {
      // add to array of files to be deleted
      this.fileIdsToBDeletedArr.push(row['fileId']);
    } else {
    }

    (<FormArray>this.biometricDialogform.get('bioMAttch')).removeAt(index);

    this.bioMetricDataSrc.data = this.biometricDialogform.get('bioMAttch').value.map((attch) => ({
      filesize: attch['filesize'],
      filename: attch['filename'],
      fileId: attch['fileId'],
    }));
  }

  downloadFile(fileId, row, index) {
    if (fileId === undefined) {
      const filename = 'unsol_biometric.zip';
      const blob = new Blob([row], {
        type: 'application/zip',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
    if (fileId !== undefined) {
      const filename = 'unsol_biometric.zip';
      this.sancLoadSvc.downloadBiomAttchmnts([fileId]).subscribe(
        (data) => {
          const blob = new Blob([data], {
            type: 'application/zip',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}

export const biometricdValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const biomMTyp = control.get('bioMType');
  const bioMVal = control.get('bioMVal');
  const bioMAtt = control.get('bioMAttch');
  return biomMTyp.value != null && bioMVal.value != null && bioMAtt.value.length != 0
    ? null
    : { bioMInvalid: true };
};
