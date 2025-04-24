import { Test, TestingModule } from '@nestjs/testing';
import { FilesManager } from './files.manager';

describe('FilesService', () => {
  let service: FilesManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesManager],
    }).compile();

    service = module.get<FilesManager>(FilesManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
