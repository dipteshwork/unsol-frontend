import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesLkComponent } from './categories-lk.component';

describe('CategoriesLkComponent', () => {
  let component: CategoriesLkComponent;
  let fixture: ComponentFixture<CategoriesLkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesLkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesLkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
