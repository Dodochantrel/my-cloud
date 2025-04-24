import { Test, TestingModule } from '@nestjs/testing';
import { TmdbRepositoryService } from '../videos/tmdb/tmdb-repository.service';

describe('TmdbRepositoryService', () => {
  let service: TmdbRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmdbRepositoryService],
    }).compile();

    service = module.get<TmdbRepositoryService>(TmdbRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
