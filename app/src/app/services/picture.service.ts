import { NotificationService } from './notification.service';
import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  mapFromPictureCategoriesDto,
  mapFromPictureCategoryDto,
  PictureCategoryDto,
} from '../dto/picture-category.dto';
import { map, Observable } from 'rxjs';
import { PictureCategory } from '../class/picture-category';
import { PicturesByCategoryDto } from '../dto/pictures-by-category.dto';
import { FileWidth } from '../tools/file-width.type';
import {
  addOne,
  removeByIdWithRecurtion,
} from '../tools/update-table';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  private getMyResource = httpResource<PictureCategoryDto[]>(
    () => `${environment.apiUrl}pictures-categories`
  );

  categories = computed(() =>
    this.getMyResource.value()
      ? mapFromPictureCategoriesDto(this.getMyResource.value()!)
      : []
  );
  isLoading = computed(() => this.getMyResource.isLoading());

  createPictureCategory(
    name: string,
    groupsId: number[],
    parentId: number | null = null
  ) {
    const body = {
      name,
      groupsId,
      parentId,
    };
    return this.httpClient
      .post<PictureCategoryDto>(
        `${environment.apiUrl}pictures-categories`,
        body
      )
      .pipe(map((dto) => mapFromPictureCategoryDto(dto)))
      .subscribe({
        next: (pictureCategory: PictureCategory) => {
          this.notificationService.showSuccess(
            'Succès',
            `La catégorie ${pictureCategory.name!} a été créée avec succès.`
          );
          this.isAddingOrEditingCategory.set(false);
          if (parentId) {
            const updated = this.insertCategoryRecursive(
              this.categories(),
              parentId,
              pictureCategory
            );
            this.getMyResource.set(updated);
          } else {
            this.getMyResource.set(addOne(this.categories(), pictureCategory));
          }
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur',
            `Erreur lors de la création de la catégorie : ${error.message}`
          );
        },
        complete: () => {
          this.isLoadingCreateOrEdit = false;
        },
      });
  }

  private insertCategoryRecursive(
    categories: PictureCategory[],
    parentId: number,
    newCategory: PictureCategory
  ): PictureCategory[] {
    return categories.map((cat) => {
      if (cat.id === parentId) {
        return {
          ...cat,
          childrens: [...cat.childrens, newCategory], // ajout ici
        };
      }
      if (cat.childrens && cat.childrens.length > 0) {
        return {
          ...cat,
          childrens: this.insertCategoryRecursive(
            cat.childrens,
            parentId,
            newCategory
          ),
        };
      }
      return cat;
    });
  }

  public isAddingOrEditingCategory = signal(false);
  public selectedCategory = signal<PictureCategory | null>(null);
  public isCreatingNewCategory: boolean = false;
  public isLoadingCreateOrEdit: boolean = false;

  editPictureCategory(id: number, name: string, groupsId: number[]) {
    const body = { name, groupsId };
    return this.httpClient
      .patch<PictureCategoryDto>(
        `${environment.apiUrl}pictures-categories/${id}`,
        body
      )
      .pipe(map((dto) => mapFromPictureCategoryDto(dto)))
      .subscribe({
        next: (pictureCategory: PictureCategory) => {
          this.notificationService.showSuccess(
            'Succès',
            `La catégorie ${pictureCategory.name!} a été modifiée avec succès.`
          );
          this.isAddingOrEditingCategory.set(false);
          const updatedCategories = this.updateCategoryInTree(
            this.categories(),
            pictureCategory
          );
          this.getMyResource.set(updatedCategories);
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur',
            `Erreur lors de la modification de la catégorie : ${error.message}`
          );
        },
        complete: () => {
          this.isLoadingCreateOrEdit = false;
        },
      });
  }

  private updateCategoryInTree(
    categories: PictureCategory[],
    updated: PictureCategory
  ): PictureCategory[] {
    return categories.map((cat) => {
      if (cat.id === updated.id) {
        return {
          ...cat,
          name: updated.name,
          groupsId: updated.groupsId
        };
      }
      if (cat.childrens && cat.childrens.length > 0) {
        return {
          ...cat,
          childrens: this.updateCategoryInTree(cat.childrens, updated),
        };
      }
      return cat;
    });
  }  

  changeParentPictureCategory(
    id: number,
    parentId: number | null
  ): Observable<PictureCategory> {
    const body = {
      parentId,
    };
    return this.httpClient
      .patch<PictureCategoryDto>(
        `${environment.apiUrl}pictures-categories/${id}/parent`,
        body
      )
      .pipe(map((dto) => mapFromPictureCategoryDto(dto)));
  }

  getPicturesByCategory(
    categoryId: number
  ): Observable<{ ids: number[]; count: number }> {
    return this.httpClient.get<PicturesByCategoryDto>(
      `${environment.apiUrl}pictures/categories/${categoryId}`
    );
  }

  getFile(id: number, width: FileWidth): Observable<Blob> {
    return this.httpClient.get(
      `${environment.apiUrl}pictures/${id}?width=${width}`,
      {
        responseType: 'blob',
      }
    );
  }

  uploadFiles(pictureCategoryId: number, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('categoryId', pictureCategoryId.toString());
    return this.httpClient.post(`${environment.apiUrl}pictures/`, formData, {
      responseType: 'blob',
    });
  }

  deleteCategoy(id: number) {
    return this.httpClient
      .delete<void>(`${environment.apiUrl}pictures-categories/${id}`)
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Succès',
            `L'image a été supprimée avec succès.`
          );
          this.getMyResource.set(
            removeByIdWithRecurtion(this.categories(), id)
          );
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur',
            `Erreur lors de la suppression de l'image : ${error.message}`
          );
        },
      });
  }
}
