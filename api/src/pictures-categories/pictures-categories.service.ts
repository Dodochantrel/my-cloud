import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { PicturesCategory } from './pictures-category.entity';
import { Group } from 'src/groups/group.entity';

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

  public async update(
    id: number,
    name: string,
    groupsId: number[],
  ): Promise<PicturesCategory> {
    const category = await this.picturesCategoryRepository.findOne({
      where: { id },
      relations: ['user', 'groups'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    this.canAccess(category.user.id, groupsId, category);

    category.name = name;
    category.groups = groupsId.map((groupId) => new Group({ id: groupId }));

    return this.picturesCategoryRepository.save(category);
  }

  public async canAccess(
    userId: number,
    groupsId: number[],
    picturesCategory: PicturesCategory,
  ) {
    if (picturesCategory.user.id === userId) {
      throw new UnauthorizedException('User cannot access their own category');
    }
    if (picturesCategory.groups.length === 0) {
      throw new UnauthorizedException('User cannot access their own category');
    }
    if (!picturesCategory.groups.some((group) => groupsId.includes(group.id))) {
      throw new UnauthorizedException(
        'User cannot access this category due to group restrictions',
      );
    }
  }
}
