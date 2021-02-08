import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-status-removed-dialog',
  templateUrl: './status-removed-dialog.component.html',
  styleUrls: ['./status-removed-dialog.component.scss']
})
export class StatusRemovedDialogComponent implements OnInit {

  statusRemovedDialogForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<StatusRemovedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }) { }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    const statusRemovedFm = new FormGroup({
      removedStatusDte: new FormControl({ value: '' }, [Validators.required]),
      removedStatusReason: new FormControl({ value: '', disabled: false }, [Validators.required])
    });

    this.statusRemovedDialogForm = statusRemovedFm;
  }

  onSubmit(formdata, event) { // aw need to validate the date format
    console.log('recived teh following data ', formdata);
    console.log('the event was', event);
    this.dialogRef.close(formdata);
  }
}
