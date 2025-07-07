import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasting } from './tasting.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TastingCategory } from './tasting-category.entity';
import { DataSource, In, Like } from 'typeorm';
import { PageQuery } from 'src/pagination/page-query';
import { PaginatedResponse } from 'src/pagination/paginated-response';
import { FileData } from 'src/files/file-data.entity';
import { User } from 'src/users/user.entity';
import { FilesManager, WidthOptions } from 'src/files/files.manager';

@Injectable()
export class TastingsService {
  constructor(
    @InjectRepository(Tasting)
    private tastingRepository: Repository<Tasting>,
    @InjectRepository(TastingCategory)
    private tastingCategoryRepository: Repository<TastingCategory>,
    private readonly dataSource: DataSource,
    private readonly filesManager: FilesManager,
  ) {}

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
    categoriesId: number[],
    search: string | null = null,
  ): Promise<PaginatedResponse<Tasting>> {
    const where: any = { user: { id: userId } };

    if (categoriesId && categoriesId.length)
      where.category = { id: In(categoriesId) };
    if (search) where.name = Like(`%${search}%`);

    const [data, count] = await this.tastingRepository.findAndCount({
      where,
      relations: ['category'],
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

  async update(userId: number, tasting: Tasting): Promise<Tasting> {
    const existingTasting = this.tastingRepository.findOne({
      where: { id: tasting.id, user: { id: userId } },
    });
    if (!existingTasting) {
      throw new Error('Tasting not found or does not belong to user');
    }
    tasting.category = await this.tastingCategoryRepository.findOne({
      where: { id: tasting.category.id },
    });
    return this.tastingRepository.save(tasting);
  }

  async findOne(id: number, userId: number): Promise<Tasting | null> {
    const tasting = await this.tastingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['fileData', 'user'],
    });
    if (!tasting) {
      throw new NotFoundException(
        `Tasting with ID ${id} not found for user with ID ${userId}`,
      );
    }
    return tasting;
  }

  async uploadFile(id: number, file: Express.Multer.File, userId: number) {
    const tasting = await this.tastingRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['fileData', 'user'],
    });
    const fileData = this.createOrEditFileData(
      file,
      tasting.id,
      userId,
      tasting.fileData?.id || null,
    );
    tasting.fileData
      ? await this.filesManager.updateFile(file, tasting.fileData, fileData)
      : await this.filesManager.uploadFile(file, fileData);
  }

  async getFile(
    id: number,
    userId: number,
    width?: WidthOptions,
  ): Promise<string> {
    const tasting = await this.findOne(id, userId);
    if (!tasting.fileData) {
      throw new NotFoundException(`File for tasting with ID ${id} not found`);
    }
    return this.filesManager.getFile(tasting.fileData, width);
  }

  private createOrEditFileData(
    file: Express.Multer.File,
    tastingId: number,
    userId: number,
    id: number = null,
  ): FileData {
    return new FileData({
      id: id,
      path: 'tastings/',
      mimetype: file.mimetype,
      size: file.size,
      tasting: new Tasting({ id: tastingId }),
      user: new User({ id: userId }),
    });
  }
}
