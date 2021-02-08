import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesLkComponent } from './countries-lk.component';

describe('CountriesLkComponent', () => {
  let component: CountriesLkComponent;
  let fixture: ComponentFixture<CountriesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
