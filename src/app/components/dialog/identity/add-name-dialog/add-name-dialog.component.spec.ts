import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNameDialogComponent } from './add-name-dialog.component';

describe('AddNameDialogComponent', () => {
  let component: AddNameDialogComponent;
  let fixture: ComponentFixture<AddNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
