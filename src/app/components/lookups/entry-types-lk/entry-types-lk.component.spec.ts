import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryTypesLkComponent } from './entry-types-lk.component';

describe('EntryTypesLkComponent', () => {
  let component: EntryTypesLkComponent;
  let fixture: ComponentFixture<EntryTypesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryTypesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryTypesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
