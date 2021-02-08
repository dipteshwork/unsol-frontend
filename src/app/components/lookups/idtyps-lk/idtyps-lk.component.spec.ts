import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdtypsLkComponent } from './idtyps-lk.component';

describe('IdtypsLkComponent', () => {
  let component: IdtypsLkComponent;
  let fixture: ComponentFixture<IdtypsLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdtypsLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdtypsLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
