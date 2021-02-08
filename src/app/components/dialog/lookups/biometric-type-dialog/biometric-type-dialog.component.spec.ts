import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BiometricTypeDialogComponent } from './biometric-type-dialog.component';

describe('BiometricTypeDialogComponent', () => {
  let component: BiometricTypeDialogComponent;
  let fixture: ComponentFixture<BiometricTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricTypeDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
