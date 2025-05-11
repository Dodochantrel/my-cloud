import { TestBed } from '@angular/core/testing';

import { AgendaEventService } from './agenda-event.service';

describe('AgendaEventService', () => {
  let service: AgendaEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
