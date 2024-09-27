import { TestBed } from '@angular/core/testing';

import { FindVotingService } from './find-voting.service';

describe('FindVotingService', () => {
  let service: FindVotingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindVotingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
