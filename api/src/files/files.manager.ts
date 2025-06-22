import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FileData } from './file-data.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesManager {
  constructor(
    @InjectRepository(FileData)
    private fileDataRepository: Repository<FileData>,
  ) {}

  private readonly logger = new Logger(FilesManager.name);

  private save(fileData: FileData): Promise<FileData> {
    fileData.prepareFileName();
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

  async uploadFile(
    file: Express.Multer.File,
    fileData: FileData,
  ): Promise<string> {
    try {
      const fileDataSaved = await this.save(fileData);
      const storageBasePath = process.env.STORAGE_BASE_PATH;

      const basePath = path.join(storageBasePath, fileDataSaved.path);
      const filePath = path.join(
        basePath,
        `${fileDataSaved.name}${this.getExtension(file.mimetype)}`,
      );

      // Crée le dossier si nécessaire
      await fs.promises.mkdir(basePath, { recursive: true });

      // Enregistre le fichier sur le disque
      await fs.promises.writeFile(filePath, file.buffer);

      return this.getFile(fileDataSaved);
    } catch (error) {
      this.logger.error('Error uploading file', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(fileData: FileData): Promise<void> {
    try {
      const storageBasePath = process.env.STORAGE_BASE_PATH;

      const basePath = path.join(storageBasePath, fileData.path);
      const filePath = path.join(
        basePath,
        `${fileData.name}${this.getExtension(fileData.mimetype)}`,
      );

      await fs.promises.unlink(filePath);
      this.logger.log(`File deleted: ${filePath}`);
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
  ): Promise<string> {
    try {
      // Supprimer l'ancien fichier
      await this.deleteFile(oldFileData);
      // Ajouter le nouveau fichier
      await this.uploadFile(newFile, newFileData);

      return this.getFile(newFileData);
    } catch (error) {
      this.logger.error('Error updating file', error);
      throw new Error('Failed to update file');
    }
  }

  getFile(fileData: FileData): string {
    if (!fileData) {
      throw new NotFoundException('File not found');
    }
    const storageBasePath = path.resolve(process.env.STORAGE_BASE_PATH);
    const fileName = `${fileData.name}${this.getExtension(fileData.mimetype)}`;
    return path.join(storageBasePath, 'recipes', fileName);
  }

  private getExtension(mimetype: string): string {
    const parts = mimetype.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid mimetype: ${mimetype}`);
    }
    return `.${parts[1]}`;
  }
}
