import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderLkComponent } from './gender-lk.component';

describe('GenderLkComponent', () => {
  let component: GenderLkComponent;
  let fixture: ComponentFixture<GenderLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenderLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
