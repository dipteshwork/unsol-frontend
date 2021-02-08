import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatureDialogComponent } from './add-feature-dialog.component';

describe('addFeatureDialogComponent', () => {
  let component: AddFeatureDialogComponent;
  let fixture: ComponentFixture<AddFeatureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeatureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
