import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { PicturesCategory } from './pictures-category.entity';

@Injectable()
export class PicturesCategoriesService {
  constructor(
    @InjectRepository(PicturesCategory)
    private picturesCategoryRepository: Repository<PicturesCategory>,
    private readonly dataSource: DataSource,
  ) {}

  public async save(
    picturesCategory: PicturesCategory,
  ): Promise<PicturesCategory> {
    return this.picturesCategoryRepository.save(picturesCategory);
  }

  public async findMy(
    userId: number,
    groupsId: number[],
  ): Promise<PicturesCategory[]> {
    const qb = this.picturesCategoryRepository.createQueryBuilder('category');
    qb.leftJoin('category.user', 'user');
    qb.leftJoin('category.groups', 'group');
    qb.where('category.parent IS NULL').andWhere(
      new Brackets((qb) => {
        qb.where('user.id = :userId', { userId });

        if (groupsId.length > 0) {
          qb.orWhere('group.id IN (:...groupsId)', { groupsId });
        }
      }),
    );
    qb.orderBy('category.name', 'ASC');
    const roots = await qb.getMany();

    const treeRepo = this.dataSource.getTreeRepository(PicturesCategory);
    const trees: PicturesCategory[] = [];

    for (const root of roots) {
      const fullTree = await treeRepo.findDescendantsTree(root);
      trees.push(fullTree);
    }

    return trees;
  }

  public async delete(id: number): Promise<void> {
    await this.picturesCategoryRepository.delete(id);
  }
}
