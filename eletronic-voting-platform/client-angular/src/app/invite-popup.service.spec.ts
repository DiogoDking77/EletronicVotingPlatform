import { TestBed } from '@angular/core/testing';

import { InvitePopupService } from './invite-popup.service';

describe('InvitePopupService', () => {
  let service: InvitePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
