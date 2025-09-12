import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TastingCategory } from './tasting-category.entity';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { TASTING_CATEGORIES_ICONS } from './tasting-categories-icons';

@Injectable()
export class TastingCategoriesService {
  constructor(
    @InjectRepository(TastingCategory)
    private tastingCategoryRepository: Repository<TastingCategory>,
    private readonly dataSource: DataSource,
  ) {}

  async getAll(
    pageQuery: PageQuery,
  ): Promise<PaginatedResponse<TastingCategory>> {
    const repo = this.dataSource.manager.getTreeRepository(TastingCategory);

    const [data, count] = await repo
      .createQueryBuilder('category')
      .where('category.parentId IS NULL')
      .orderBy('category.id', 'ASC')
      .skip(pageQuery.offset)
      .take(pageQuery.limit)
      .getManyAndCount();

    const tree = await Promise.all(
      data.map((root) => repo.findDescendantsTree(root)),
    );

    return new PaginatedResponse<TastingCategory>(tree, pageQuery, count);
  }

  async findOne(id: string): Promise<TastingCategory | null> {
    const category = await this.tastingCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Tasting category not found');
    } else {
      return category;
    }
  }

  async create(category: TastingCategory): Promise<TastingCategory> {
    return this.tastingCategoryRepository.save(category);
  }

  async update(category: TastingCategory): Promise<TastingCategory> {
    const existingCategory = await this.tastingCategoryRepository.findOne({
      where: { id: category.id },
    });
    if (!existingCategory) {
      throw new NotFoundException('Tasting category not found');
    }
    return this.tastingCategoryRepository.save(category);
  }

  async delete(id: string) {
    const existingCategory = await this.tastingCategoryRepository.findOne({
      where: { id: id },
    });
    if (!existingCategory) {
      throw new NotFoundException('Tasting category not found');
    }
    return this.tastingCategoryRepository.delete(id);
  }

  getIcons(): string[] {
    return TASTING_CATEGORIES_ICONS;
  }
}
