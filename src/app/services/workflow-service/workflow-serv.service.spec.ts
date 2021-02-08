import { TestBed, inject } from '@angular/core/testing';

import { WorkflowServService } from './workflow-serv.service';
describe('WorkflowServService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowServService],
    });
  });

  it('should be created', inject(
    [WorkflowServService],
    (service: WorkflowServService) => {
      expect(service).toBeTruthy();
    }
  ));
});
