import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  mapFromDtosToRecipes,
  mapFromDtoToRecipe,
  RecipeDto,
} from '../dto/recipe.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { map, Observable } from 'rxjs';
import { Recipe, RecipeType } from '../class/recipe';
import { Paginated } from '../class/paginated';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private readonly httpClient: HttpClient) {}

  public search = signal<string>('');
  public type = signal<RecipeType>('main');

  private getMyResource = httpResource<PaginatedDto<RecipeDto>>(
    () =>
      `${environment.apiUrl}recipes?type=${this.type()}search=${this.search()}&page=1&limit=20`
  );

  recipes = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromDtosToRecipes(resource.data)
      : [];
  });
  public isLoading = computed(() => this.getMyResource.isLoading());

  getFile(id: number): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}recipes/files/${id}`, {
      responseType: 'blob',
    });
  }

  create(
    type: string,
    name: string,
    description: string,
    groupsId: number[]
  ): Observable<Recipe> {
    const body = {
      type: type,
      name: name,
      description: description,
      groupsId: groupsId,
    };
    return this.httpClient
      .post<RecipeDto>(`${environment.apiUrl}recipes`, body)
      .pipe(
        map((response: RecipeDto) => {
          return mapFromDtoToRecipe(response);
        })
      );
  }

  uploadFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    return this.httpClient.post(
      `${environment.apiUrl}recipes/files`,
      formData,
      {
        responseType: 'blob',
      }
    );
  }

  getById(id: number): Observable<Recipe> {
    return this.httpClient
      .get<RecipeDto>(`${environment.apiUrl}recipes/${id}`)
      .pipe(
        map((response: RecipeDto) => {
          return mapFromDtoToRecipe(response);
        })
      );
  }

  patch(
    id: number,
    type: string,
    name: string,
    description: string,
    groupsId: number[]
  ): Observable<Recipe> {
    const body = {
      type: type,
      name: name,
      description: description,
      groupsId: groupsId,
    };
    return this.httpClient
      .patch<RecipeDto>(`${environment.apiUrl}recipes/${id}`, body)
      .pipe(
        map((response: RecipeDto) => {
          return mapFromDtoToRecipe(response);
        })
      );
  }
}
