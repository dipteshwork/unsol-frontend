import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NationalityDialogComponent } from './nationality-dialog.component';

describe('NationalityDialogComponent', () => {
  let component: NationalityDialogComponent;
  let fixture: ComponentFixture<NationalityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
