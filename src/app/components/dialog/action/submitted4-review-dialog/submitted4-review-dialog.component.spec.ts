import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Submitted4ReviewDialogComponent } from './submitted4-review-dialog.component';

describe('Submitted4ReviewDialogComponent', () => {
  let component: Submitted4ReviewDialogComponent;
  let fixture: ComponentFixture<Submitted4ReviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Submitted4ReviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Submitted4ReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
