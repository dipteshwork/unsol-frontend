import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesDialogComponent } from './features-dialog.component';

describe('FeaturesDialogComponent', () => {
  let component: FeaturesDialogComponent;
  let fixture: ComponentFixture<FeaturesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturesDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
