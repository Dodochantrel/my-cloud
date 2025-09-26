import { TestBed } from '@angular/core/testing';

import { SeenVideoService } from './seen-video.service';

describe('SeenVideoService', () => {
  let service: SeenVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeenVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
