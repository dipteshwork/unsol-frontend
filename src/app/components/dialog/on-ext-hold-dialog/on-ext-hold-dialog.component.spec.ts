import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnExtHoldDialogComponent } from './on-ext-hold-dialog.component';

describe('OnExtHoldDialogComponent', () => {
  let component: OnExtHoldDialogComponent;
  let fixture: ComponentFixture<OnExtHoldDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnExtHoldDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnExtHoldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
