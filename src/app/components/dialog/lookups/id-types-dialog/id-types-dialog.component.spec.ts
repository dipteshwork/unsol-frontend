import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdTypesDialogComponent } from './id-types-dialog.component';

describe('IdTypesDialogComponent', () => {
  let component: IdTypesDialogComponent;
  let fixture: ComponentFixture<IdTypesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdTypesDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdTypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
