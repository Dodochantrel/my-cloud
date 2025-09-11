import { Test, TestingModule } from '@nestjs/testing';
import { TastingCategoriesController } from './tasting-categories.controller';

describe('TastingCategoriesController', () => {
  let controller: TastingCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TastingCategoriesController],
    }).compile();

    controller = module.get<TastingCategoriesController>(TastingCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
