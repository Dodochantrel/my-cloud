import { Test, TestingModule } from '@nestjs/testing';
import { PicturesCategoriesService } from './pictures-categories.service';

describe('PicturesCategoriesService', () => {
  let service: PicturesCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicturesCategoriesService],
    }).compile();

    service = module.get<PicturesCategoriesService>(PicturesCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
