import { TestBed, inject } from '@angular/core/testing';

import { AddSanctionMessageService } from './add-sanction.service';

describe('AddSanctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddSanctionMessageService],
    });
  });

  it('should be created', inject(
    [AddSanctionMessageService],
    (service: AddSanctionMessageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
