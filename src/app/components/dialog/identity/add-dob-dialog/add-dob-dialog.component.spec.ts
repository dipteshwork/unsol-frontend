import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDobDialogComponent } from './add-dob-dialog.component';

describe('AddDobDialogComponent', () => {
  let component: AddDobDialogComponent;
  let fixture: ComponentFixture<AddDobDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDobDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
