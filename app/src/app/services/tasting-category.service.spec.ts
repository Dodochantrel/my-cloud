import { TestBed } from '@angular/core/testing';

import { TastingCategoryService } from './tasting-category.service';

describe('TastingCategoryService', () => {
  let service: TastingCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TastingCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
