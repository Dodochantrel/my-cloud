import { Injectable } from '@nestjs/common';
import { Picture } from './picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesManager, WidthOptions } from 'src/files/files.manager';
import { FileData } from 'src/files/file-data.entity';
import { User } from 'src/users/user.entity';
import { PicturesCategory } from 'src/pictures-categories/pictures-category.entity';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
    private readonly filesManager: FilesManager,
  ) {}

  public async save(picture: Picture): Promise<Picture> {
    return this.pictureRepository.save(picture);
  }

  public async uploadPictures(
    files: Array<Express.Multer.File>,
    userId: number,
    categoryId: number,
  ) {
    const uploadPromises = files.map(async (file) => {
      const picture = await this.save(
        new Picture({
          pictureCategory: new PicturesCategory({ id: categoryId }),
        }),
      );
      const fileData = this.createOrEditFileData(file, picture.id, userId);
      return this.filesManager.uploadFile(file, fileData);
    });

    return await Promise.all(uploadPromises);
  }

  private createOrEditFileData(
    file: Express.Multer.File,
    pictureId: number,
    userId: number,
    id: number = null,
  ): FileData {
    return new FileData({
      id: id ? id : undefined,
      path: 'pictures/',
      mimetype: file.mimetype,
      size: file.size,
      picture: new Picture({ id: pictureId }),
      user: new User({ id: userId }),
    });
  }

  public async getPicturesByCategory(
    categoryId,
  ): Promise<{ ids: number[]; count: number }> {
    const [data, count] = await this.pictureRepository.findAndCount({
      where: {
        pictureCategory: { id: categoryId },
      },
      select: ['id'],
    });
    return {
      ids: data.map((picture) => picture.id),
      count: count,
    };
  }

  public async getFileById(
    groupsId: number[],
    id: number,
    width?: WidthOptions,
  ): Promise<string> {
    const picture = await this.pictureRepository.findOne({
      where: {
        id: id,
      },
      relations: ['fileData', 'pictureCategory.groups'],
    });

    this.canAccess(picture, groupsId);

    if (!picture || !picture.fileData) {
      throw new Error(
        'Picture not found or does not have associated file data',
      );
    }

    return this.filesManager.getFile(picture.fileData, width);
  }

  private canAccess(picture: Picture, groupsId: number[]) {
    if (!picture) {
      throw new Error('Picture not found');
    }

    const categories = Array.isArray(picture.pictureCategory)
      ? picture.pictureCategory
      : picture.pictureCategory
        ? [picture.pictureCategory]
        : [];
    const hasAccess = categories.some((category) =>
      category.groups?.some((group) => groupsId.includes(group.id)),
    );

    if (!hasAccess) {
      throw new Error('You do not have access to this picture');
    }
  }
}
