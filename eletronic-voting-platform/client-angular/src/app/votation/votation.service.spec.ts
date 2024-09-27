import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { VotationService } from './votation.service';

describe('NewVotingService', () => {
  let service: VotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Adicione esta linha para configurar o módulo com HttpClientModule
    });
    service = TestBed.inject(VotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

