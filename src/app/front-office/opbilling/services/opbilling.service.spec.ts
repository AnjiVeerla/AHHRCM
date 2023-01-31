import { TestBed } from '@angular/core/testing';

import { OpbillingService } from './opbilling.service';

describe('OpbillingService', () => {
  let service: OpbillingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpbillingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
