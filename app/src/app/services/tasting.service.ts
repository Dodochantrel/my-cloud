import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tasting } from '../class/tasting';
import { Paginated } from '../class/paginated';
import { map, Observable } from 'rxjs';
import { mapFromDtosToTastings, mapFromDtoToTasting, TastingDto } from '../dto/tasting.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment.development';
import {
  mapFromDtosToTastingCategories,
  TastingCategoryDto,
} from '../dto/tasting-category.dto';
import { TastingCategory } from '../class/tasting-category';

@Injectable({
  providedIn: 'root',
})
export class TastingService {
  constructor(private readonly httpClient: HttpClient) {}

  getCategories(): Observable<TastingCategory[]> {
    return this.httpClient
      .get<TastingCategoryDto[]>(`${environment.apiUrl}tastings/categories`)
      .pipe(map(mapFromDtosToTastingCategories));
  }  

  getRecipes(
    categoryId: number,
    search: string,
    page: number,
    limit: number
  ): Observable<Paginated<Tasting>> {
    return this.httpClient
      .get<PaginatedDto<TastingDto>>(
        `${environment.apiUrl}tastings?categoryId=${categoryId}&search=${search}&page=${page}&limit=${limit}`
      )
      .pipe(
        map((response: PaginatedDto<TastingDto>) => {
          return new Paginated<Tasting>(
            mapFromDtosToTastings(response.data),
            response.meta
          );
        })
      );
  }

  add(name: string, categoryId: number, rating: number, description: string): Observable<Tasting> {
    return this.httpClient
      .post<TastingDto>(`${environment.apiUrl}tastings`, {
        name,
        categoryId,
        rating,
        description,
      })
      .pipe(map(mapFromDtoToTasting));
  }
}
