import { TestBed } from '@angular/core/testing';

import { NewAdvancedVotingService } from './new-advanced-voting.service';

describe('NewAdvancedVotingService', () => {
  let service: NewAdvancedVotingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewAdvancedVotingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
