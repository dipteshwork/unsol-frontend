import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiEmailDialogComponent } from './noti-email-dialog.component';

describe('RoleDialogComponent', () => {
  let component: NotiEmailDialogComponent;
  let fixture: ComponentFixture<NotiEmailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotiEmailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotiEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
