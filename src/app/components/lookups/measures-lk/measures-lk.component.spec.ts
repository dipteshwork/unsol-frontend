import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresLkComponent } from './measures-lk.component';

describe('MeasuresLkComponent', () => {
  let component: MeasuresLkComponent;
  let fixture: ComponentFixture<MeasuresLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeasuresLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuresLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
