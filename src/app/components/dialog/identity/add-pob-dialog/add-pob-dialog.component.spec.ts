import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPobDialogComponent } from './add-pob-dialog.component';

describe('AddPobDialogComponent', () => {
  let component: AddPobDialogComponent;
  let fixture: ComponentFixture<AddPobDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPobDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
