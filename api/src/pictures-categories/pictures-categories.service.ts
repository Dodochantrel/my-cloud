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
    userId: string,
    groupsId: string[],
  ): Promise<PicturesCategory[]> {
    const qb = this.picturesCategoryRepository.createQueryBuilder('category');
    qb.leftJoin('category.user', 'user');
    qb.leftJoinAndSelect('category.groups', 'group');
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
      const fullTree = await treeRepo.findDescendantsTree(root, {
        relations: ['groups'],
      });
      trees.push(fullTree);
    }

    return trees;
  }

  public async delete(id: string): Promise<void> {
    await this.picturesCategoryRepository.delete(id);
  }

  public async update(
    id: string,
    name: string,
    groupsId: string[],
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

  public async changeParent(
    id: string,
    userId: string,
    parentId: string | null,
  ): Promise<PicturesCategory> {
    const category = await this.picturesCategoryRepository.findOne({
      where: { id },
      relations: ['user', 'groups'],
    });

    if (!category) {
      throw new Error('Category not found');
    }

    this.canAccess(
      userId,
      category.groups.map((g) => g.id),
      category,
    );

    let newParent: PicturesCategory | null = null;

    if (parentId !== null) {
      newParent = await this.picturesCategoryRepository.findOneBy({
        id: parentId,
      });
      if (!newParent) {
        throw new Error('New parent category not found');
      }
    }

    category.parent = newParent;

    return this.picturesCategoryRepository.save(category);
  }

  private async canAccess(
    userId: string,
    groupsId: string[],
    picturesCategory: PicturesCategory,
  ) {
    if (
      picturesCategory.user.id !== userId &&
      !picturesCategory.groups.some((group) => groupsId.includes(group.id))
    ) {
      throw new UnauthorizedException('User cannot access their own category');
    }
  }
}
