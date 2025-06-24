import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromPictureCategoriesDto, mapFromPictureCategoryDto, PictureCategoryDto } from '../dto/picture-category.dto';
import { map, Observable } from 'rxjs';
import { PictureCategory } from '../class/picture-category';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<PictureCategory[]> {
    return this.httpClient.get<PictureCategoryDto[]>(
      `${environment.apiUrl}pictures-categories`
    ).pipe(map(mapFromPictureCategoriesDto));
  }

  create(name: string, groupsId: number[], parentId: number | null = null): Observable<PictureCategory> {
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

  edit(id: number, name: string, groupsId: number[]): Observable<PictureCategory> {
    const body = {
      name,
      groupsId
    }
    return this.httpClient.patch<PictureCategoryDto>(
      `${environment.apiUrl}pictures-categories/${id}`,
      body
    ).pipe(map(dto => mapFromPictureCategoryDto(dto)));
  }

  changeParent(
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
}
