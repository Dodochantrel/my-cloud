import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tasting } from '../class/tasting';
import { Paginated } from '../class/paginated';
import { map, Observable } from 'rxjs';
import { mapFromDtosToTastings, TastingDto } from '../dto/tasting.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TastingService {
  constructor(private readonly httpClient: HttpClient) {}

  getRecipes(
    categoryId: string,
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
}
