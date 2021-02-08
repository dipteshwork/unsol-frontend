import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnHoldDialogComponent } from './on-hold-dialog.component';

describe('OnHoldDialogComponent', () => {
  let component: OnHoldDialogComponent;
  let fixture: ComponentFixture<OnHoldDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnHoldDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnHoldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
