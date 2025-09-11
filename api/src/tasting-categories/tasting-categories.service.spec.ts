import { Test, TestingModule } from '@nestjs/testing';
import { TastingCategoriesService } from './tasting-categories.service';

describe('TastingCategoriesService', () => {
  let service: TastingCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TastingCategoriesService],
    }).compile();

    service = module.get<TastingCategoriesService>(TastingCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
