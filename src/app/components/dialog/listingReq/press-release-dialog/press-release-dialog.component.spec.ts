import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressReleaseDialogComponent } from './press-release-dialog.component';

describe('PressReleaseDialogComponent', () => {
  let component: PressReleaseDialogComponent;
  let fixture: ComponentFixture<PressReleaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressReleaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressReleaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
