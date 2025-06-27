import { Injectable } from '@nestjs/common';
import { Tasting } from './tasting.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TastingCategory } from './tasting-category.entity';
import { DataSource } from 'typeorm';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';

@Injectable()
export class TastingsService {
  constructor(
    @InjectRepository(Tasting)
    private tastingRepository: Repository<Tasting>,
    @InjectRepository(TastingCategory)
    private tastingCategoryRepository: Repository<TastingCategory>,
    private readonly dataSource: DataSource,
  ) {
    this.tastingCategoryRepository.save([
      // new TastingCategory({
      //   name: 'Bière',
      //   icon: 'default-child-icon',
      // }),
      // new TastingCategory({
      //   name: 'Blonde',
      //   icon: 'default-child-icon',
      //   parent: new TastingCategory({ id: 13 }),
      // }),
      // new TastingCategory({
      //   name: 'Brune',
      //   icon: 'default-child-icon',
      //   parent: new TastingCategory({ id: 13 }),
      // }),
      // new TastingCategory({
      //   name: 'Blanche',
      //   icon: 'default-child-icon',
      //   parent: new TastingCategory({ id: 13 }),
      // }),
      // new TastingCategory({
      //   name: 'Ambrée',
      //   icon: 'default-child-icon',
      //   parent: new TastingCategory({ id: 13 }),
      // }),
      // new TastingCategory({
      //   name: 'IPA',
      //   icon: 'default-child-icon',
      //   parent: new TastingCategory({ id: 13 }),
      // }),
    ]);
  }

  findCategories(): Promise<TastingCategory[]> {
    return this.dataSource.manager
      .getTreeRepository(TastingCategory)
      .findTrees();
  }

  public async save(tasting: Tasting): Promise<Tasting> {
    return this.tastingRepository.save(tasting);
  }

  public async findById(id: number, userId: number): Promise<Tasting | null> {
    return this.tastingRepository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  public async findMy(
    userId: number,
    pageQuery: PageQuery,
    categoryId: number | null = null,
    search: string | null = null,
  ): Promise<PaginatedResponse<Tasting>> {
    const where: any = { user: { id: userId } };

    if (categoryId !== null) where.category = { id: categoryId };
    if (search) where.name = { $like: `%${search}%` };

    const [data, count] = await this.tastingRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: pageQuery.limit,
      skip: (pageQuery.page - 1) * pageQuery.limit,
    });
    return new PaginatedResponse<Tasting>(
      data,
      new PageQuery(pageQuery.page, pageQuery.limit),
      count,
    );
  }

  update(userId: number, tasting: Tasting): Promise<Tasting> {
    const existingTasting = this.tastingRepository.findOne({
      where: { id: tasting.id, user: { id: userId } },
    });
    if (!existingTasting) {
      throw new Error('Tasting not found or does not belong to user');
    }
    return this.tastingRepository.save(tasting);
  }
}
