import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmittedByDialogComponent } from './submitted-by-dialog.component';

const mockData = {
  isReadOnly: true,
};

describe('SubmittedByDialogComponent', () => {
  let component: SubmittedByDialogComponent;
  let fixture: ComponentFixture<SubmittedByDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittedByDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedByDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.data = mockData;

    expect(component).toBeTruthy();
  });
});
