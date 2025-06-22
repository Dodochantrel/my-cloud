import { Test, TestingModule } from '@nestjs/testing';
import { PicturesCategoriesController } from './pictures-categories.controller';

describe('PicturesCategoriesController', () => {
  let controller: PicturesCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PicturesCategoriesController],
    }).compile();

    controller = module.get<PicturesCategoriesController>(PicturesCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
