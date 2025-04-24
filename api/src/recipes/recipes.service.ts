import { Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';
import { FilesManager } from 'src/files/files.manager';
import { FileData } from 'src/files/file-data.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private userRepository: Repository<Recipe>,
    private readonly filesManager: FilesManager,
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
    console.log(recipe);
    return this.userRepository.save(recipe);
  }

  async getById(id: number, userId: number): Promise<Recipe> {
    const recipe = await this.userRepository.findOne({
      where: { id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipe, userId);
    return recipe;
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async update(recipe: Recipe, userId: number): Promise<Recipe> {
    const recipeInDb = await this.userRepository.findOne({
      where: { id: recipe.id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipeInDb, userId);
    return this.userRepository.save(recipe);
  }

  async uploadFile(file: Express.Multer.File, id: number, userId: number) {
    const recipe = await this.userRepository.findOne({
      where: { id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipe, userId);
    const fileData = await this.createFileData(file, id, userId);
    console.log(fileData);
    await this.filesManager.uploadFile(file, fileData);
  }

  createFileData(
    file: Express.Multer.File,
    recipeId: number,
    userId: number,
  ): Promise<FileData> {
    return this.filesManager.save(
      new FileData({
        path: 'recipes/',
        mimetype: file.mimetype,
        size: file.size,
        recipe: new Recipe({ id: recipeId }),
        user: new User({ id: userId }),
      }),
    );
  }

  private canAccess(recipe: Recipe, userId: number) {
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    // Si l'utilisateur n'est pas dans le groupe de la recette ou s'il n'est pas le propriétaire de la recette
    if (
      !recipe.groups.some((group) => group.id === userId) &&
      recipe.user.id !== userId
    ) {
      throw new NotFoundException('Recipe not found');
    }
  }
}
