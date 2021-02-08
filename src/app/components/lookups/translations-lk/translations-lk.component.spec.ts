import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationsLkComponent } from './translations-lk.component';

describe('TranslationsLkComponent', () => {
  let component: TranslationsLkComponent;
  let fixture: ComponentFixture<TranslationsLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TranslationsLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
