import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private userRepository: Repository<Recipe>,
  ) {}

  async getAll(
    userId: number,
    groupsId: number[],
    pageQuery: PageQuery,
  ): Promise<PaginatedResponse<Recipe>> {
    const [data, count] = await this.userRepository.findAndCount({
      where: [{ user: { id: userId } }, { group: In(groupsId) }],
      relations: ['user', 'group'],
      skip: (pageQuery.page - 1) * pageQuery.limit,
      take: pageQuery.limit,
      order: {
        createdAt: 'DESC',
      },
    });

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
}
