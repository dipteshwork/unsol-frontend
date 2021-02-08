import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingstatLkComponent } from './livingstat-lk.component';

describe('LivingstatLkComponent', () => {
  let component: LivingstatLkComponent;
  let fixture: ComponentFixture<LivingstatLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LivingstatLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivingstatLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
