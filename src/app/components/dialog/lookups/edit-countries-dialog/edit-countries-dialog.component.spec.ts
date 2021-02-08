import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountriesDialogComponent } from './edit-countries-dialog.component';

describe('EditCountriesDialogComponent', () => {
  let component: EditCountriesDialogComponent;
  let fixture: ComponentFixture<EditCountriesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCountriesDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCountriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
