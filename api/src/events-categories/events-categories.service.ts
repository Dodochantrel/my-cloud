import { Injectable } from '@nestjs/common';
import { EventsDataCategory } from './events-data-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';

@Injectable()
export class EventsCategoriesService {
  constructor(
    @InjectRepository(EventsDataCategory)
    private eventsDataCategory: Repository<EventsDataCategory>,
  ) {}

  async getAll(
    search: string,
    pageQuery: PageQuery,
    relations: string[] = [],
  ): Promise<PaginatedResponse<EventsDataCategory>> {
    const [user, count] = await this.eventsDataCategory.findAndCount({
      where: search ? { name: Like(`%${search}%`) } : {},
      take: pageQuery.limit,
      skip: pageQuery.offset,
      relations,
    });
    return new PaginatedResponse<EventsDataCategory>(user, pageQuery, count);
  }

  async save(
    eventsDataCategory: EventsDataCategory,
  ): Promise<EventsDataCategory> {
    return this.eventsDataCategory.save(eventsDataCategory);
  }

  async delete(id: string): Promise<void> {
    await this.eventsDataCategory.delete(id);
  }
}
