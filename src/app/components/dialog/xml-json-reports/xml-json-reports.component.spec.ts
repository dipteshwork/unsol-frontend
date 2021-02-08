import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlJsonReportsComponent } from './xml-json-reports.component';

describe('XmlJsonReportsComponent', () => {
  let component: XmlJsonReportsComponent;
  let fixture: ComponentFixture<XmlJsonReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [XmlJsonReportsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlJsonReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
