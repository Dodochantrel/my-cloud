import { Injectable } from '@nestjs/common';
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

  async save(fileData: FileData): Promise<FileData> {
    fileData.prepareFileName();
    return this.fileDataRepository.save(fileData);
  }

  async uploadFile(file: Express.Multer.File, fileData: FileData) {
    const storageBasePath =
      process.env.STORAGE_BASE_PATH ||
      path.join(process.cwd(), 'assets', 'files');

    const basePath = path.join(storageBasePath, fileData.path);

    // Extraire l'extension depuis le mimetype (ex: image/png → .png)
    const filePath = path.join(
      basePath,
      `${fileData.name}.${this.getExtension(file.mimetype)}`,
    );

    // Crée le dossier si nécessaire
    await fs.promises.mkdir(basePath, { recursive: true });

    // Enregistre le fichier sur le disque
    await fs.promises.writeFile(filePath, file.buffer);
  }

  private getExtension(mimetype: string): string {
    const parts = mimetype.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid mimetype: ${mimetype}`);
    }
    return `.${parts[1]}`;
  }
}
