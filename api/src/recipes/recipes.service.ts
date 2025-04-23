import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private userRepository: Repository<Recipe>,
  ) {}

  async getMy(
    userId: number,
    groupsId: number[],
    pageQuery: PageQuery,
  ): Promise<PaginatedResponse<Recipe>> {
    const query = this.userRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.groups', 'group')
      .where('user.id = :userId', { userId });

    if (groupsId.length > 0) {
      query.orWhere('group.id IN (:...groupsId)', { groupsId });
    }

    query
      .skip((pageQuery.page - 1) * pageQuery.limit)
      .take(pageQuery.limit)
      .orderBy('recipe.createdAt', 'DESC');

    const [data, count] = await query.getManyAndCount();

    return new PaginatedResponse<Recipe>(data, pageQuery, count);
  }

  save(recipe: Recipe): Promise<Recipe> {
    return this.userRepository.save(recipe);
  }

  getById(id: number): Promise<Recipe> {
    return this.userRepository.findOneBy({ id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  update(recipe: Recipe, userId: number): Promise<Recipe> {
    return this.userRepository.save({
      ...recipe,
      user: { id: userId },
    });
  }
}
