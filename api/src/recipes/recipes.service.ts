import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { PageQuery } from 'src/pagination/page-query';
import { FilesManager } from 'src/files/files.manager';
import { FileData } from 'src/files/file-data.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private readonly filesManager: FilesManager,
  ) {}

  async getMy(
    userId: string,
    groupsId: string[],
    pageQuery: PageQuery,
    type: string,
    search: string,
  ): Promise<PaginatedResponse<Recipe>> {
    const query = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.groups', 'group')
      .where(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId });
          if (groupsId.length > 0) {
            qb.orWhere('group.id IN (:...groupsId)', { groupsId });
          }
        }),
      )
      .andWhere('recipe.type = :type', { type })
      .andWhere('recipe.name LIKE :search', { search: `%${search}%` })
      .skip((pageQuery.page - 1) * pageQuery.limit)
      .take(pageQuery.limit)
      .orderBy('recipe.createdAt', 'DESC');

    const [data, count] = await query.getManyAndCount();

    return new PaginatedResponse<Recipe>(data, pageQuery, count);
  }

  save(recipe: Recipe): Promise<Recipe> {
    return this.recipeRepository.save(recipe);
  }

  async getById(id: string, userId: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipe, userId);
    return recipe;
  }

  delete(id: number): Promise<DeleteResult> {
    return this.recipeRepository.delete(id);
  }

  async getFile(id: string, userId: string): Promise<string> {
    const fileData = await this.getById(id, userId);
    return this.filesManager.getFile(fileData.fileData);
  }

  async update(recipe: Recipe, userId: string): Promise<Recipe> {
    const recipeInDb = await this.recipeRepository.findOne({
      where: { id: recipe.id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipeInDb, userId);
    return this.recipeRepository.save(recipe);
  }

  async uploadFile(file: Express.Multer.File, id: string, userId: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['fileData', 'user', 'groups'],
    });
    this.canAccess(recipe, userId);
    const fileData = this.createOrEditFileData(file, id, userId);
    recipe.fileData
      ? await this.filesManager.updateFile(file, recipe.fileData, fileData)
      : await this.filesManager.uploadFile(file, fileData);
    return this.filesManager.getFile(fileData);
  }

  createOrEditFileData(
    file: Express.Multer.File,
    recipeId: string,
    userId: string,
    id: string = null,
  ): FileData {
    return new FileData({
      id: id,
      path: 'recipes/',
      mimetype: file.mimetype,
      size: file.size,
      recipe: new Recipe({ id: recipeId }),
      user: new User({ id: userId }),
    });
  }

  private canAccess(recipe: Recipe, userId: string) {
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    // Si l'utilisateur n'est pas dans le groupe de la recette ou s'il n'est pas le propriétaire de la recette
    if (
      !recipe.groups.some((group) => group.id === userId) &&
      recipe.user.id !== userId
    ) {
      // Throw unauthorized
      throw new UnauthorizedException(
        'You are not authorized to access this recipe',
      );
    }
  }
}
