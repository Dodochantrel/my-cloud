import { Component, effect, input } from '@angular/core';
import { PictureService } from '../../../services/picture.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-photo',
  imports: [FileUpload, ButtonModule, CommonModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css'
})
export class PhotoComponent {
  categoryId = input<number>();
  public picturesFilesUrls: string[] = [];
  public selectedFilesCount: number = 0;
  public isAddingFiles: boolean = false;

  constructor(
    private readonly pictureService: PictureService,
    private readonly notificationService: NotificationService
  ) {
    effect(() => {
      if (this.categoryId()) {
        this.getPicturesByCategory();
      }
    });
  }

  getPicturesByCategory() {
    this.pictureService.getPicturesByCategory(this.categoryId()!).subscribe({
      next: (content) => {
        this.getPictures(content);
      },
      error: (error) => {
        this.notificationService.showError('Erreur', 'Erreur lors de la récupération des photos');
      }
    });
  } 

  getPictures(content: { ids: number[], count: number }) {
    content.ids.forEach((id) => {
      this.getPictureFile(id);
    });    
  }

  getPictureFile(id: number) {
    this.pictureService.getFile(id).subscribe({
      next: (blob: Blob) => {
        this.picturesFilesUrls.push(URL.createObjectURL(blob));
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load file', error.message);
      }
    });
  }

  choose(event: any, callback: any) {
    callback();
  }

  onFileSelect(event: { files: File[] }) {
    this.selectedFilesCount = this.selectedFilesCount + event.files.length;
  }

  onRemoveTemplatingFile(event: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.selectedFilesCount--;
  }

  uploadEvent(callback: any) {
    callback();
  }

}
