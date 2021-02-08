import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesLkComponent } from './features-lk.component';

describe('FeaturesLkComponent', () => {
  let component: FeaturesLkComponent;
  let fixture: ComponentFixture<FeaturesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
