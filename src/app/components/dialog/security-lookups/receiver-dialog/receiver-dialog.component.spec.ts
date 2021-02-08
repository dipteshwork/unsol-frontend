import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiverDialogComponent } from './receiver-dialog.component';

describe('ReceiverDialogComponent', () => {
  let component: ReceiverDialogComponent;
  let fixture: ComponentFixture<ReceiverDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiverDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
