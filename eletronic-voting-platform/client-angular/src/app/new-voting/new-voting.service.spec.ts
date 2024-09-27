import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { NewVotingService } from './new-voting.service';

describe('NewVotingService', () => {
  let service: NewVotingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Adicione esta linha para configurar o módulo com HttpClientModule
    });
    service = TestBed.inject(NewVotingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
