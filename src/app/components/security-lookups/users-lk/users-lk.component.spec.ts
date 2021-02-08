import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLkComponent } from './users-lk.component';

describe('UsersLkComponent', () => {
  let component: UsersLkComponent;
  let fixture: ComponentFixture<UsersLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
