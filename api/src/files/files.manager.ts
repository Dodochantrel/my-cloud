import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FileData } from './file-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class FilesManager {
  constructor(
    @InjectRepository(FileData)
    private fileDataRepository: Repository<FileData>,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(FilesManager.name);

  private save(fileData: FileData): Promise<FileData> {
    fileData.prepareFileName();
    console.log('FileData to save:', fileData);
    return this.fileDataRepository.save(fileData);
  }

  async getOne(id: number): Promise<FileData> {
    const fileData = await this.fileDataRepository.findOne({
      where: { id },
    });
    if (!fileData) {
      this.logger.error(`FileData with id ${id} not found`);
      throw new NotFoundException(`FileData with id ${id} not found`);
    }
    return fileData;
  }

  async delete(id: number): Promise<void> {
    const fileData = await this.getOne(id);
    if (!fileData) {
      this.logger.error(`FileData with id ${id} not found`);
      throw new Error(`FileData with id ${id} not found`);
    }
    await this.fileDataRepository.remove(fileData);
    this.logger.log(`FileData with id ${id} deleted`);
  }

  async uploadFile(file: Express.Multer.File, fileData: FileData) {
    try {
      const fileDataSaved = await this.save(fileData);
      const basePath = this.prepareBasePath(fileDataSaved);

      return await this.saveFile(file, basePath, fileDataSaved);
    } catch (error) {
      this.logger.error('Error uploading file', error);
      throw new Error('Failed to upload file');
    }
  }

  private prepareBasePath(fileData: FileData): string {
    const storageBasePath = this.configService.get<string>('STORAGE_BASE_PATH');

    return path.join(storageBasePath, fileData.path);
  }

  async saveFile(
    file: Express.Multer.File,
    basePath: string,
    fileData: FileData,
  ) {
    const writePromises = [];

    const metadata = await sharp(file.buffer).metadata();
    const originalWidth = metadata.width;

    for (let i = 0; i < 3; i++) {
      const taux = 100 - i * 40;
      const dirPath = path.join(basePath, `${taux}`);
      const filePath = path.join(
        dirPath,
        `${fileData.name}${this.getExtension(file.mimetype)}`,
      );

      // Crée le dossier si nécessaire
      await fs.promises.mkdir(dirPath, { recursive: true });

      // Redimensionne l'image avec sharp
      const resizePromise = sharp(file.buffer)
        .resize({ width: Math.round(originalWidth * (taux / 100)) })
        .toFile(filePath);

      writePromises.push(resizePromise);
    }

    // Attend que tous les fichiers soient écrits
    return await Promise.all(writePromises);
  }

  async deleteFile(fileData: FileData): Promise<void> {
    try {
      const storageBasePath =
        this.configService.get<string>('STORAGE_BASE_PATH');

      const basePath = path.join(storageBasePath, fileData.path);
      // Récupérer tout les répertoires dans le chemin
      const directories = await fs.promises.readdir(basePath, {
        withFileTypes: true,
      });
      // Supprimer les répertoires vides
      for (const dir of directories) {
        const filePath = path.join(
          basePath,
          `${dir.name}/${fileData.name}${this.getExtension(fileData.mimetype)}`,
        );

        await fs.promises.unlink(filePath);
        this.logger.log(`File deleted: ${filePath}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn(`File not found: ${error.path}`);
      } else {
        this.logger.error('Error deleting file', error);
        throw new Error('Failed to delete file');
      }
    }
  }

  async updateFile(
    newFile: Express.Multer.File,
    oldFileData: FileData,
    newFileData: FileData,
  ) {
    try {
      newFileData.id = oldFileData.id;
      // Supprimer l'ancien fichier
      await this.deleteFile(oldFileData);
      // Ajouter le nouveau fichier
      return await this.uploadFile(newFile, newFileData);
    } catch (error) {
      this.logger.error('Error updating file', error);
      throw new Error('Failed to update file');
    }
  }

  getFile(fileData: FileData, widthOptions: WidthOptions = 'big'): string {
    if (!fileData) {
      throw new NotFoundException('File not found');
    }
    const width = widthOptions ? this.getWidth(widthOptions) : null;
    const storageBasePath = path.resolve(
      this.configService.get<string>('STORAGE_BASE_PATH'),
    );
    const fileName = `${fileData.name}${this.getExtension(fileData.mimetype)}`;
    return path.join(storageBasePath, fileData.path, `${width}`, fileName);
  }

  private getExtension(mimetype: string): string {
    const parts = mimetype.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid mimetype: ${mimetype}`);
    }
    return `.${parts[1]}`;
  }

  private getWidth(widthOption: WidthOptions): number {
    switch (widthOption) {
      case 'small':
        return 20;
      case 'medium':
        return 60;
      case 'big':
        return 100;
      default:
        throw new Error(`Invalid width option: ${widthOption}`);
    }
  }
}

export type WidthOptions = 'small' | 'medium' | 'big';
