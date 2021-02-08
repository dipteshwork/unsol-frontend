import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimesLkComponent } from './regimes-lk.component';

describe('RegimesLkComponent', () => {
  let component: RegimesLkComponent;
  let fixture: ComponentFixture<RegimesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegimesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
