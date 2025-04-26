import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  mapFromDtosToRecipes,
  mapFromDtoToRecipe,
  RecipeDto,
} from '../dto/recipe.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { map, Observable } from 'rxjs';
import { Recipe } from '../class/recipe';
import { Paginated } from '../class/paginated';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private readonly httpClient: HttpClient) {}

  getRecipes(
    type: string,
    search: string,
    page: number,
    limit: number
  ): Observable<Paginated<Recipe>> {
    return this.httpClient
      .get<PaginatedDto<RecipeDto>>(
        `${environment.apiUrl}recipes?type=${type}&search=${search}&page=${page}&limit=${limit}`
      )
      .pipe(
        map((response: PaginatedDto<RecipeDto>) => {
          return new Paginated<Recipe>(
            mapFromDtosToRecipes(response.data),
            response.meta
          );
        })
      );
  }

  getFile(id: number): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}recipes/files/${id}`, {
      responseType: 'blob',
    });
  }
}
