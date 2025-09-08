import { NotificationService } from './notification.service';
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromPictureCategoriesDto, mapFromPictureCategoryDto, PictureCategoryDto } from '../dto/picture-category.dto';
import { map, Observable } from 'rxjs';
import { PictureCategory } from '../class/picture-category';
import { PicturesByCategoryDto } from '../dto/pictures-by-category.dto';
import { FileWidth } from '../tools/file-width.type';
import { addOne, findIndexById } from '../tools/update-table';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(private readonly httpClient: HttpClient, private readonly notificationService: NotificationService) {}

  private getMyResource = httpResource<PictureCategoryDto[]>( () => `${environment.apiUrl}pictures-categories` );  

  categories = computed(() => this.getMyResource.value() ? mapFromPictureCategoriesDto(this.getMyResource.value()!) : []);
  isLoading = computed(() => this.getMyResource.isLoading());

  createPictureCategory(name: string, groupsId: number[], parentId: number | null = null) {
    const body = {
      name,
      groupsId,
      parentId
    }
    return this.httpClient.post<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto))).subscribe({
      next: (pictureCategory: PictureCategory) => {
        this.notificationService.showSuccess(
          'Succès',
          `La catégorie ${pictureCategory.name!} a été créée avec succès.`
        );
        this.isAddingOrEditingCategory.set(false);
        addOne(this.categories(), pictureCategory);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          `Erreur lors de la création de la catégorie : ${error.message}`
        );
      },
      complete: () => {
        this.isLoadingCreateOrEdit = false;
      }
    });
  }

  public isAddingOrEditingCategory = signal(false);
  public selectedCategory = signal<PictureCategory | null>(null);
  public isLoadingCreateOrEdit: boolean = false;

  editPictureCategory(id: number, name: string, groupsId: number[]) {
    const body = {
      name,
      groupsId
    }
    return this.httpClient.patch<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories/${id}`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto))).subscribe({
      next: (pictureCategory: PictureCategory) => {
        this.notificationService.showSuccess(
          'Succès',
          `La catégorie ${pictureCategory.name!} a été modifiée avec succès.`
        );
        this.isAddingOrEditingCategory.set(false);
        const index = findIndexById(this.categories(), pictureCategory.id);
        this.categories()[index] = pictureCategory;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          `Erreur lors de la modification de la catégorie : ${error.message}`
        );
      },
      complete: () => {
        this.isLoadingCreateOrEdit = false;
      }
    });
  }

  changeParentPictureCategory(
    id: number,
    parentId: number | null
  ): Observable<PictureCategory> {
    const body = {
      parentId
    }
    return this.httpClient.patch<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories/${id}/parent`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto)));
  }

  getPicturesByCategory(categoryId: number): Observable<{ ids: number[]; count: number }> {
    return this.httpClient.get<PicturesByCategoryDto>(
      `${environment.apiUrl}pictures/categories/${categoryId}`
    );
  }

  getFile(id: number, width: FileWidth): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}pictures/${id}?width=${width}`, {
      responseType: 'blob',
    });
  }

  uploadFiles(pictureCategoryId: number, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('categoryId', pictureCategoryId.toString());
    return this.httpClient.post(
      `${environment.apiUrl}pictures/`,
      formData,
      {
        responseType: 'blob',
      }
    );
  }
}
