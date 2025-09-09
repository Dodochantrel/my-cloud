import { Test, TestingModule } from '@nestjs/testing';
import { EventsCategoriesController } from './events-categories.controller';

describe('EventsCategoriesController', () => {
  let controller: EventsCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsCategoriesController],
    }).compile();

    controller = module.get<EventsCategoriesController>(EventsCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
