import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromPictureCategoriesDto, PictureCategoryDto } from '../dto/picture-category.dto';
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
}
