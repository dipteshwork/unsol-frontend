import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowVersionsComponent } from './workflow-versions.component';

describe('WorkflowVersionsComponent', () => {
  let component: WorkflowVersionsComponent;
  let fixture: ComponentFixture<WorkflowVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowVersionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
