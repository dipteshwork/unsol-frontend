import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusDelistedDialogComponent } from './status-delisted-dialog.component';

describe('StatusDelistedDialogComponent', () => {
  let component: StatusDelistedDialogComponent;
  let fixture: ComponentFixture<StatusDelistedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusDelistedDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDelistedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
