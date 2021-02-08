import { TestBed, inject } from '@angular/core/testing';

import { LookupCollproviderProvider } from './lookup-collprovider.service';

describe('LookupCollproviderProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LookupCollproviderProvider],
    });
  });

  it('should be created', inject(
    [LookupCollproviderProvider],
    (service: LookupCollproviderProvider) => {
      expect(service).toBeTruthy();
    }
  ));
});
