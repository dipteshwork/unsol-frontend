import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesLkComponent } from './roles-lk.component';

describe('RolesLkComponent', () => {
  let component: RolesLkComponent;
  let fixture: ComponentFixture<RolesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
