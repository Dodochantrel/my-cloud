import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromPictureCategoriesDto, mapFromPictureCategoryDto, PictureCategoryDto } from '../dto/picture-category.dto';
import { map, Observable } from 'rxjs';
import { PictureCategory } from '../class/picture-category';
import { PicturesByCategoryDto } from '../dto/pictures-by-category.dto';
import { FileWidth } from '../tools/file-width.type';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(private readonly httpClient: HttpClient) {}

  getAllPictureCategory(): Observable<PictureCategory[]> {
    return this.httpClient.get<PictureCategoryDto[]>(
      `${environment.apiUrl}pictures-categories`
    ).pipe(map(mapFromPictureCategoriesDto));
  }

  createPictureCategory(name: string, groupsId: number[], parentId: number | null = null): Observable<PictureCategory> {
    const body = {
      name,
      groupsId,
      parentId
    }
    return this.httpClient.post<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto)));
  }

  editPictureCategory(id: number, name: string, groupsId: number[]): Observable<PictureCategory> {
    const body = {
      name,
      groupsId
    }
    return this.httpClient.patch<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories/${id}`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto)));
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
