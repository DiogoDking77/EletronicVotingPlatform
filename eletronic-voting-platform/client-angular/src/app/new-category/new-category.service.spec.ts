import { TestBed } from '@angular/core/testing';

import { NewCategoryService } from './new-category.service';

describe('NewCategoryService', () => {
  let service: NewCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
