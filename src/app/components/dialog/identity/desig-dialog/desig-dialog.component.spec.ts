import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesigDialogComponent } from './desig-dialog.component';

describe('DesigDialogComponent', () => {
  let component: DesigDialogComponent;
  let fixture: ComponentFixture<DesigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesigDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
