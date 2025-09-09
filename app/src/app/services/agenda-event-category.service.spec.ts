import { TestBed } from '@angular/core/testing';

import { AgendaEventCategoryService } from './agenda-event-category.service';

describe('AgendaEventCategoryService', () => {
  let service: AgendaEventCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaEventCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
