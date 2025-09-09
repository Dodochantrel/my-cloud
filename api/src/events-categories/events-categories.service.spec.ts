import { Test, TestingModule } from '@nestjs/testing';
import { EventsCategoriesService } from './events-categories.service';

describe('EventsCategoriesService', () => {
  let service: EventsCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsCategoriesService],
    }).compile();

    service = module.get<EventsCategoriesService>(EventsCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
