import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LivingStatusDialogComponent } from './living-status-dialog.component';

describe('LivingStatusDialogComponent', () => {
  let component: LivingStatusDialogComponent;
  let fixture: ComponentFixture<LivingStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LivingStatusDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivingStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
