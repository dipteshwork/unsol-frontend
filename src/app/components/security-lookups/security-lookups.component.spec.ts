import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLookupsComponent } from './security-lookups.component';

describe('SecurityLookupsComponent', () => {
  let component: SecurityLookupsComponent;
  let fixture: ComponentFixture<SecurityLookupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityLookupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLookupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
