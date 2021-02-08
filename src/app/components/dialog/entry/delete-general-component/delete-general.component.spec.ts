import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomatricTypeComponent } from './biomatric-type.component';

describe('BiomatricTypeComponent', () => {
  let component: BiomatricTypeComponent;
  let fixture: ComponentFixture<BiomatricTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiomatricTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiomatricTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
