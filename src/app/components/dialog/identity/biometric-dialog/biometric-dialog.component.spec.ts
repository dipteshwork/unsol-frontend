import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricDialogComponent } from './biometric-dialog.component';

describe('BiometricDialogComponent', () => {
  let component: BiometricDialogComponent;
  let fixture: ComponentFixture<BiometricDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
