import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeasuresDialogComponent } from './edit-measures-dialog.component';

describe('EditMeasuresDialogComponent', () => {
  let component: EditMeasuresDialogComponent;
  let fixture: ComponentFixture<EditMeasuresDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditMeasuresDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeasuresDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
