import { TestBed } from '@angular/core/testing';

import { ContractmanagementService } from './contractmanagement.service';

describe('ContractmanagementService', () => {
  let service: ContractmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
