import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SancEntryTypesDialogComponent } from './sanc-entry-types-dialog.component';

describe('SancEntryTypesDialogComponent', () => {
  let component: SancEntryTypesDialogComponent;
  let fixture: ComponentFixture<SancEntryTypesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SancEntryTypesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SancEntryTypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
