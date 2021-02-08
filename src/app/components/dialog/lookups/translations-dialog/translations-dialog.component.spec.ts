import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationsDialogComponent } from './translations-dialog.component';

describe('TranslationsDialogComponent', () => {
  let component: TranslationsDialogComponent;
  let fixture: ComponentFixture<TranslationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
