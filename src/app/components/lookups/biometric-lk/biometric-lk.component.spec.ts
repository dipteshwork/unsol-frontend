import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricLkComponent } from './biometric-lk.component';

describe('BiometricLkComponent', () => {
  let component: BiometricLkComponent;
  let fixture: ComponentFixture<BiometricLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BiometricLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
