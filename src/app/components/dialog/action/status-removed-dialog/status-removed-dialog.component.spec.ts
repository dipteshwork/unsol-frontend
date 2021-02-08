import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusRemovedDialogComponent } from './status-removed-dialog.component';

describe('StatusRemovedDialogComponent', () => {
  let component: StatusRemovedDialogComponent;
  let fixture: ComponentFixture<StatusRemovedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusRemovedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusRemovedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
