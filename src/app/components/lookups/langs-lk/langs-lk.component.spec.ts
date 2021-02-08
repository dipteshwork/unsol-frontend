import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangsLkComponent } from './langs-lk.component';

describe('LangsLkComponent', () => {
  let component: LangsLkComponent;
  let fixture: ComponentFixture<LangsLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LangsLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangsLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
