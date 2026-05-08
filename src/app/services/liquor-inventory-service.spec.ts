import { TestBed } from '@angular/core/testing';

import { LiquorInventoryService } from './liquor-inventory-service';

describe('LiquorInventoryService', () => {
  let service: LiquorInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquorInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
